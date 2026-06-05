import type * as Party from "partykit/server";
import {
  DEFAULT_SETTINGS,
  MAX_PLAYERS,
  MAX_SPECTATORS,
  MIN_PLAYERS,
  STORAGE_KEY
} from "../src/lib/constants";
import {
  activeRoundPlayerIds,
  advanceAfterMatchupResult,
  canVoteOnMatchup,
  closeCurrentVote,
  createInitialRoomState,
  createPlayer,
  currentMatchup,
  eligibleVoters,
  getAssignments,
  getPublicRoomState,
  normalizeSubmittedDefense,
  promoteDraftsAndStartVoting,
  restartRoom,
  startNewRound
} from "../src/lib/game";
import { partialSettingsSchema, clientMessageSchema, sanitizeName } from "../src/lib/validation";
import { TOPIC_PACKS } from "../src/lib/topics";
import type { ClientMessage, Player, PlayerId, RoomState, ServerMessage } from "../src/types/game";

type ConnectionState = {
  playerId?: PlayerId;
  sessionId?: string;
  messageTimestamps: number[];
};

export default class TakeupsServer implements Party.Server {
  readonly options = { hibernate: false };

  private state: RoomState;
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor(readonly room: Party.Room) {
    this.state = createInitialRoomState(room.id.toUpperCase());
  }

  async onStart() {
    const stored = await this.room.storage.get<RoomState>(STORAGE_KEY);
    this.state = stored ?? createInitialRoomState(this.room.id.toUpperCase());
    await this.recoverTimers();
    this.scheduleTimer();
  }

  async onConnect(connection: Party.Connection) {
    connection.setState({ messageTimestamps: [] } satisfies ConnectionState);
    await this.recoverTimers();
    this.sendState(connection);
  }

  async onMessage(message: string | ArrayBuffer, sender: Party.Connection) {
    if (typeof message !== "string") {
      this.sendError(sender, "Binary messages are not accepted.");
      return;
    }
    if (!this.rateLimit(sender)) {
      this.sendError(sender, "Too many actions. Slow down.");
      return;
    }

    let parsed: ClientMessage;
    try {
      parsed = clientMessageSchema.parse(JSON.parse(message)) as ClientMessage;
    } catch {
      this.sendError(sender, "Invalid message.");
      return;
    }

    try {
      await this.recoverTimers();
      await this.handleMessage(parsed, sender);
      await this.persist();
      this.scheduleTimer();
      this.broadcastState();
    } catch (error) {
      this.sendError(sender, error instanceof Error ? error.message : "Action failed.");
    }
  }

  async onClose(connection: Party.Connection) {
    await this.handleDisconnect(connection);
  }

  async onError(connection: Party.Connection) {
    await this.handleDisconnect(connection);
  }

  private async handleMessage(message: ClientMessage, sender: Party.Connection) {
    if (message.type === "join_room") {
      this.joinRoom(sender, message.name, message.sessionId);
      return;
    }

    const actor = this.actor(sender);
    if (!actor) throw new Error("Join the room before taking actions.");

    switch (message.type) {
      case "start_round":
        this.requireHost(actor.id);
        this.startRound();
        return;
      case "update_draft":
        this.updateDraft(actor.id, message.matchupId, message.text);
        return;
      case "submit_defenses":
        this.submitDefenses(actor.id, message.defenses);
        return;
      case "ready":
        this.ready(actor.id);
        return;
      case "unready":
        this.unready(actor.id);
        return;
      case "vote":
        this.vote(actor.id, message.matchupId, message.votedFor);
        return;
      case "next_round":
        this.requireHost(actor.id);
        this.nextRound();
        return;
      case "update_settings":
        this.requireHost(actor.id);
        this.updateSettings(message.settings);
        return;
      case "kick_player":
        this.requireHost(actor.id);
        this.kickPlayer(message.playerId);
        return;
      case "restart_game":
        this.requireHost(actor.id);
        this.state = restartRoom(this.state);
        return;
    }
  }

  private joinRoom(connection: Party.Connection, name: string, sessionIdFromClient?: string) {
    const now = Date.now();
    const sessionId = sessionIdFromClient ?? crypto.randomUUID();
    const existing =
      Object.values(this.state.players).find((player) => player.sessionId === sessionId) ??
      Object.values(this.state.spectators).find((player) => player.sessionId === sessionId);

    if (existing) {
      existing.connected = true;
      existing.name = sanitizeName(name) || existing.name;
      this.attachConnection(connection, existing.id, sessionId);
      this.transferHostIfNeeded();
      this.state.updatedAt = now;
      return;
    }

    const inProgress = this.state.phase !== "lobby";
    const playerCount = Object.keys(this.state.players).length;
    const spectatorCount = Object.keys(this.state.spectators).length;

    if (inProgress && !this.state.settings.allowLateJoin) {
      throw new Error("This room is locked while the round is active.");
    }

    if (!inProgress && playerCount < MAX_PLAYERS) {
      const player = createPlayer({
        name,
        sessionId,
        isHost: playerCount === 0 && !this.state.hostId,
        joinedAt: now,
        index: playerCount
      });
      this.state.players[player.id] = player;
      if (!this.state.hostId) this.state.hostId = player.id;
      this.attachConnection(connection, player.id, sessionId);
      this.state.totalScores[player.id] ??= 0;
      this.state.updatedAt = now;
      return;
    }

    if (!this.state.settings.allowSpectators) {
      throw new Error(playerCount >= MAX_PLAYERS ? "The room is full." : "Spectators are disabled.");
    }
    if (spectatorCount >= MAX_SPECTATORS) {
      throw new Error("The spectator gallery is full.");
    }

    const spectator = createPlayer({
      name,
      sessionId,
      isHost: false,
      joinedAt: now,
      index: playerCount + spectatorCount
    });
    this.state.spectators[spectator.id] = spectator;
    this.attachConnection(connection, spectator.id, sessionId);
    this.state.updatedAt = now;
  }

  private startRound() {
    if (this.state.phase !== "lobby" && this.state.phase !== "round_result") {
      throw new Error("A round cannot start right now.");
    }
    const activePlayers = Object.values(this.state.players).filter((player) => player.connected);
    if (activePlayers.length < MIN_PLAYERS) {
      throw new Error(`Takeups needs at least ${MIN_PLAYERS} connected players.`);
    }
    this.state = startNewRound(this.state);
  }

  private updateDraft(playerId: PlayerId, matchupId: string, text: string) {
    if (this.state.phase !== "writing") throw new Error("Drafts are closed.");
    if (!this.state.players[playerId]) throw new Error("Spectators cannot submit defenses.");
    if (this.state.readyPlayers[playerId]) throw new Error("You are already locked in.");
    const matchup = this.state.matchups.find((candidate) => candidate.id === matchupId);
    if (!matchup || (matchup.playerA !== playerId && matchup.playerB !== playerId)) {
      throw new Error("That assignment is not yours.");
    }
    this.state.drafts[playerId] = {
      ...(this.state.drafts[playerId] ?? {}),
      [matchupId]: text.slice(0, this.state.settings.maxDefenseChars)
    };
    this.state.updatedAt = Date.now();
  }

  private submitDefenses(playerId: PlayerId, defenses: Record<string, string>) {
    if (this.state.phase !== "writing") throw new Error("Submissions are closed.");
    if (this.state.readyPlayers[playerId]) throw new Error("You are already locked in.");
    for (const [matchupId, text] of Object.entries(defenses)) {
      this.updateDraft(playerId, matchupId, text);
    }
    this.ready(playerId);
  }

  private ready(playerId: PlayerId) {
    if (this.state.phase !== "writing") throw new Error("Ready is only available while writing.");
    const assigned = getAssignments(this.state, playerId);
    if (assigned.length !== 2) throw new Error("You do not have two assignments.");
    for (const assignment of assigned) {
      const text = normalizeSubmittedDefense(
        this.state.drafts[playerId]?.[assignment.matchupId],
        this.state.settings.maxDefenseChars
      );
      if (text === "DEFENSE NOT FILED.") {
        throw new Error("Both defenses are required before locking in.");
      }
      this.state.submissions[assignment.matchupId] = {
        ...(this.state.submissions[assignment.matchupId] ?? {}),
        [playerId]: text
      };
    }
    this.state.readyPlayers[playerId] = true;
    this.state.updatedAt = Date.now();

    const activeIds = activeRoundPlayerIds(this.state);
    if (activeIds.length && activeIds.every((id) => this.state.readyPlayers[id])) {
      this.state = promoteDraftsAndStartVoting(this.state);
    }
  }

  private unready(playerId: PlayerId) {
    if (this.state.phase !== "writing") throw new Error("You can only unlock while writing.");
    delete this.state.readyPlayers[playerId];
    for (const matchup of this.state.matchups) {
      delete this.state.submissions[matchup.id]?.[playerId];
    }
    this.state.updatedAt = Date.now();
  }

  private vote(playerId: PlayerId, matchupId: string, votedFor: string) {
    if (this.state.phase !== "voting") throw new Error("Voting is not open.");
    const matchup = currentMatchup(this.state);
    if (!matchup || matchup.id !== matchupId) throw new Error("That card is not open.");
    if (!canVoteOnMatchup(this.state, matchup, playerId)) {
      throw new Error("You are not eligible to vote on this card.");
    }
    const validOptions = Object.values(matchup.optionByPlayer);
    if (!validOptions.includes(votedFor)) throw new Error("Invalid vote option.");

    this.state.votes[matchup.id] = {
      ...(this.state.votes[matchup.id] ?? {}),
      [playerId]: votedFor
    };
    this.state.updatedAt = Date.now();

    const eligible = eligibleVoters(this.state, matchup);
    if (eligible.every((player) => this.state.votes[matchup.id]?.[player.id])) {
      this.state = closeCurrentVote(this.state);
    }
  }

  private nextRound() {
    if (this.state.phase === "round_result") {
      if (
        this.state.settings.roundsToPlay !== null &&
        this.state.roundNumber >= this.state.settings.roundsToPlay
      ) {
        this.state = {
          ...this.state,
          phase: "game_over",
          updatedAt: Date.now()
        };
        return;
      }
      this.state = startNewRound(this.state);
      return;
    }
    if (this.state.phase === "game_over") {
      this.state = restartRoom(this.state);
      return;
    }
    throw new Error("Next round is not available right now.");
  }

  private updateSettings(settings: Partial<RoomState["settings"]>) {
    if (this.state.phase !== "lobby") {
      throw new Error("Settings can only be changed in the lobby.");
    }
    const parsed = partialSettingsSchema.parse(settings);
    const topicPacks =
      parsed.topicPacks?.filter((pack) => TOPIC_PACKS.includes(pack)) ?? this.state.settings.topicPacks;
    this.state.settings = {
      ...this.state.settings,
      ...parsed,
      topicPacks: topicPacks.length ? topicPacks : DEFAULT_SETTINGS.topicPacks
    };
    this.state.updatedAt = Date.now();
  }

  private kickPlayer(playerId: string) {
    if (playerId === this.state.hostId) throw new Error("Host cannot kick themselves.");
    if (this.state.phase !== "lobby") throw new Error("Players can only be removed in the lobby.");
    delete this.state.players[playerId];
    delete this.state.spectators[playerId];
    delete this.state.totalScores[playerId];
    delete this.state.roundScores[playerId];
    this.state.updatedAt = Date.now();
  }

  private async recoverTimers() {
    let changed = false;
    let guard = 0;
    const now = Date.now();

    while (guard < 10) {
      guard += 1;
      if (this.state.phase === "writing" && this.state.writingEndsAt && this.state.writingEndsAt <= now) {
        this.state = promoteDraftsAndStartVoting(this.state, now);
        changed = true;
        continue;
      }
      if (this.state.phase === "voting" && this.state.votingEndsAt && this.state.votingEndsAt <= now) {
        this.state = closeCurrentVote(this.state, now);
        changed = true;
        continue;
      }
      if (
        this.state.phase === "matchup_result" &&
        this.state.matchupResultEndsAt &&
        this.state.matchupResultEndsAt <= now
      ) {
        this.state = advanceAfterMatchupResult(this.state, now);
        changed = true;
        continue;
      }
      break;
    }

    if (changed) await this.persist();
  }

  private scheduleTimer() {
    if (this.timer) clearTimeout(this.timer);
    const now = Date.now();
    const deadline =
      this.state.phase === "writing"
        ? this.state.writingEndsAt
        : this.state.phase === "voting"
          ? this.state.votingEndsAt
          : this.state.phase === "matchup_result"
            ? this.state.matchupResultEndsAt
            : undefined;
    if (!deadline) return;

    this.timer = setTimeout(async () => {
      await this.recoverTimers();
      this.scheduleTimer();
      this.broadcastState();
    }, Math.max(0, deadline - now + 50));
  }

  private async handleDisconnect(connection: Party.Connection) {
    const actor = this.actor(connection);
    if (!actor) return;
    const stillConnected = [...this.room.getConnections()].some((candidate) => {
      if (candidate.id === connection.id) return false;
      const state = candidate.state as ConnectionState | undefined;
      return state?.playerId === actor.id;
    });
    if (stillConnected) return;

    const player = this.state.players[actor.id] ?? this.state.spectators[actor.id];
    if (player) {
      player.connected = false;
      this.transferHostIfNeeded();
      this.state.updatedAt = Date.now();
      await this.persist();
      this.broadcastState();
    }
  }

  private transferHostIfNeeded() {
    if (this.state.hostId && this.state.players[this.state.hostId]?.connected) {
      this.syncHostFlags();
      return;
    }
    const replacement =
      Object.values(this.state.players)
        .filter((player) => player.connected)
        .sort((a, b) => a.joinedAt - b.joinedAt)[0] ??
      Object.values(this.state.spectators)
        .filter((player) => player.connected)
        .sort((a, b) => a.joinedAt - b.joinedAt)[0];
    this.state.hostId = replacement?.id ?? null;
    this.syncHostFlags();
  }

  private syncHostFlags() {
    for (const player of [...Object.values(this.state.players), ...Object.values(this.state.spectators)]) {
      player.isHost = player.id === this.state.hostId;
    }
  }

  private requireHost(playerId: PlayerId) {
    if (this.state.hostId !== playerId) throw new Error("Only the host can do that.");
  }

  private actor(connection: Party.Connection): Player | undefined {
    const state = connection.state as ConnectionState | undefined;
    if (!state?.playerId) return undefined;
    return this.state.players[state.playerId] ?? this.state.spectators[state.playerId];
  }

  private attachConnection(connection: Party.Connection, playerId: PlayerId, sessionId: string) {
    connection.setState({
      ...(connection.state as ConnectionState | undefined),
      playerId,
      sessionId,
      messageTimestamps: []
    } satisfies ConnectionState);
  }

  private rateLimit(connection: Party.Connection): boolean {
    const now = Date.now();
    const state = (connection.state as ConnectionState | undefined) ?? { messageTimestamps: [] };
    const recent = state.messageTimestamps.filter((timestamp) => now - timestamp < 5000);
    recent.push(now);
    connection.setState({ ...state, messageTimestamps: recent });
    return recent.length <= 30;
  }

  private sendState(connection: Party.Connection) {
    const actor = this.actor(connection);
    const viewerId = actor?.id ?? null;
    this.send(connection, { type: "state", state: getPublicRoomState(this.state, viewerId) });
    this.send(connection, {
      type: "private_assignments",
      assignments: getAssignments(this.state, this.state.players[viewerId ?? ""] ? viewerId : null)
    });
    const card = getPublicRoomState(this.state, viewerId).currentVotingCard ?? null;
    this.send(connection, { type: "current_vote", card });
  }

  private broadcastState() {
    for (const connection of this.room.getConnections()) {
      this.sendState(connection);
    }
  }

  private send(connection: Party.Connection, message: ServerMessage) {
    connection.send(JSON.stringify(message));
  }

  private sendError(connection: Party.Connection, message: string) {
    this.send(connection, { type: "error", message });
  }

  private async persist() {
    this.state.updatedAt = Date.now();
    await this.room.storage.put(STORAGE_KEY, this.state);
  }
}

TakeupsServer satisfies Party.Worker;
