import { nanoid } from "nanoid";
import {
  DEFAULT_DEFENSE,
  DEFAULT_SETTINGS,
  MATCHUP_RESULT_SECONDS,
  MIN_PLAYERS,
  PLAYER_COLORS,
  ROOM_CODE_ALPHABET
} from "@/lib/constants";
import { applyMatchupScore, computeRoundStats, scoreMatchup } from "@/lib/scoring";
import { sampleRoomCode, shuffle } from "@/lib/shuffle";
import { filterTopics, TOPICS } from "@/lib/topics";
import { clampDefense } from "@/lib/validation";
import type {
  Assignment,
  Matchup,
  Player,
  PlayerId,
  PublicPlayer,
  PublicRoomState,
  PublicVotingCard,
  RoomSettings,
  RoomState,
  Topic
} from "@/types/game";

export function createRoomCode(): string {
  return sampleRoomCode(6, ROOM_CODE_ALPHABET);
}

export function createInitialRoomState(roomCode: string, now = Date.now()): RoomState {
  return {
    roomCode,
    hostId: null,
    phase: "lobby",
    players: {},
    spectators: {},
    settings: { ...DEFAULT_SETTINGS },
    roundNumber: 0,
    matchups: [],
    votingOrder: [],
    currentVoteIndex: 0,
    submissions: {},
    drafts: {},
    readyPlayers: {},
    votes: {},
    matchupResults: {},
    roundScores: {},
    totalScores: {},
    roundStats: {},
    createdAt: now,
    updatedAt: now
  };
}

export function createPlayer(args: {
  name: string;
  sessionId: string;
  isHost: boolean;
  joinedAt: number;
  index: number;
}): Player {
  return {
    id: `p_${nanoid(10)}`,
    sessionId: args.sessionId,
    name: args.name,
    connected: true,
    isHost: args.isHost,
    joinedAt: args.joinedAt,
    avatar: args.name.slice(0, 2).toUpperCase(),
    color: PLAYER_COLORS[args.index % PLAYER_COLORS.length]
  };
}

export function generateRound(
  players: Player[],
  topics: Topic[],
  rng: () => number = Math.random
): Matchup[] {
  if (players.length < 2) return [];
  const shuffledPlayers = shuffle(players, rng);
  const shuffledTopics = shuffle(topics, rng);

  return shuffledPlayers.map((playerA, index) => {
    const playerB = shuffledPlayers[(index + 1) % shuffledPlayers.length];
    const topic = shuffledTopics[index % shuffledTopics.length];
    const flip = rng() < 0.5;
    const optionA = `o_${nanoid(8)}`;
    const optionB = `o_${nanoid(8)}`;

    return {
      id: `m_${nanoid(10)}`,
      topicId: topic.id,
      playerA: playerA.id,
      playerB: playerB.id,
      sideByPlayer: {
        [playerA.id]: flip ? topic.sideA : topic.sideB,
        [playerB.id]: flip ? topic.sideB : topic.sideA
      },
      optionByPlayer: {
        [playerA.id]: optionA,
        [playerB.id]: optionB
      }
    };
  });
}

export function getSelectedTopics(settings: RoomSettings): Topic[] {
  const selected = filterTopics(TOPICS, settings.topicPacks, settings.intensity);
  return selected.length ? selected : TOPICS;
}

export function startNewRound(state: RoomState, now = Date.now()): RoomState {
  const activePlayers = Object.values(state.players).filter((player) => player.connected);
  const matchups = generateRound(activePlayers, getSelectedTopics(state.settings));
  const votingOrder = shuffle(matchups.map((matchup) => matchup.id));
  const drafts: RoomState["drafts"] = {};
  const submissions: RoomState["submissions"] = {};

  for (const player of activePlayers) {
    drafts[player.id] = {};
  }
  for (const matchup of matchups) {
    submissions[matchup.id] = {};
    drafts[matchup.playerA] = { ...(drafts[matchup.playerA] ?? {}), [matchup.id]: "" };
    drafts[matchup.playerB] = { ...(drafts[matchup.playerB] ?? {}), [matchup.id]: "" };
  }

  return {
    ...state,
    phase: "writing",
    roundNumber: state.roundNumber + 1,
    writingEndsAt: now + state.settings.writingSeconds * 1000,
    votingEndsAt: undefined,
    matchupResultEndsAt: undefined,
    matchups,
    votingOrder,
    currentVoteIndex: 0,
    submissions,
    drafts,
    readyPlayers: {},
    votes: {},
    matchupResults: {},
    roundScores: {},
    roundStats: {},
    updatedAt: now
  };
}

export function assignedMatchups(state: RoomState, playerId: PlayerId): Matchup[] {
  return state.matchups.filter(
    (matchup) => matchup.playerA === playerId || matchup.playerB === playerId
  );
}

export function getAssignments(state: RoomState, playerId: PlayerId | null): Assignment[] {
  if (!playerId || !state.players[playerId]) return [];
  return assignedMatchups(state, playerId).map((matchup) => {
    const topic = TOPICS.find((candidate) => candidate.id === matchup.topicId);
    const submission = state.submissions[matchup.id]?.[playerId];
    return {
      matchupId: matchup.id,
      topicPrompt: topic?.prompt ?? "Unknown topic",
      assignedSide: matchup.sideByPlayer[playerId],
      draft: state.drafts[playerId]?.[matchup.id] ?? submission ?? "",
      submission,
      locked: Boolean(state.readyPlayers[playerId])
    };
  });
}

export function currentMatchup(state: RoomState): Matchup | undefined {
  const matchupId = state.votingOrder[state.currentVoteIndex];
  return state.matchups.find((matchup) => matchup.id === matchupId);
}

export function activeRoundPlayerIds(state: RoomState): PlayerId[] {
  const ids = new Set<PlayerId>();
  for (const matchup of state.matchups) {
    ids.add(matchup.playerA);
    ids.add(matchup.playerB);
  }
  return [...ids];
}

export function activeConnectedRoundPlayers(state: RoomState): Player[] {
  const ids = new Set(activeRoundPlayerIds(state));
  return Object.values(state.players).filter((player) => ids.has(player.id) && player.connected);
}

export function canVoteOnMatchup(
  state: RoomState,
  matchup: Matchup,
  voterId: PlayerId | null
): boolean {
  if (!voterId) return false;
  if (!state.players[voterId]?.connected) return false;
  if (matchup.playerA === voterId || matchup.playerB === voterId) return false;
  return !state.votes[matchup.id]?.[voterId];
}

export function eligibleVoters(state: RoomState, matchup: Matchup): Player[] {
  return activeConnectedRoundPlayers(state).filter(
    (player) => player.id !== matchup.playerA && player.id !== matchup.playerB
  );
}

export function getVotingCard(
  state: RoomState,
  viewerId: PlayerId | null,
  reveal = false
): PublicVotingCard | undefined {
  const matchup = currentMatchup(state);
  if (!matchup) return undefined;
  const topic = TOPICS.find((candidate) => candidate.id === matchup.topicId);
  if (!topic) return undefined;
  const viewerIsOnStand = viewerId === matchup.playerA || viewerId === matchup.playerB;
  const playerA = state.players[matchup.playerA];
  const playerB = state.players[matchup.playerB];
  const base = {
    matchupId: matchup.id,
    topicPrompt: topic.prompt,
    optionA: matchup.optionByPlayer[matchup.playerA],
    optionB: matchup.optionByPlayer[matchup.playerB],
    sideA: matchup.sideByPlayer[matchup.playerA],
    sideB: matchup.sideByPlayer[matchup.playerB],
    defenseA: state.submissions[matchup.id]?.[matchup.playerA] ?? DEFAULT_DEFENSE,
    defenseB: state.submissions[matchup.id]?.[matchup.playerB] ?? DEFAULT_DEFENSE,
    canVote: canVoteOnMatchup(state, matchup, viewerId),
    hasVoted: Boolean(viewerId && state.votes[matchup.id]?.[viewerId]),
    viewerIsOnStand
  };

  if (!reveal || !playerA || !playerB) return base;

  return {
    ...base,
    revealed: {
      playerA: toPublicPlayer(state, playerA),
      playerB: toPublicPlayer(state, playerB)
    }
  };
}

export function toPublicPlayer(state: RoomState, player: Player): PublicPlayer {
  return {
    id: player.id,
    name: player.name,
    connected: player.connected,
    isHost: player.isHost,
    joinedAt: player.joinedAt,
    avatar: player.avatar,
    color: player.color,
    score: state.totalScores[player.id] ?? 0,
    roundScore: state.roundScores[player.id] ?? 0,
    ready: Boolean(state.readyPlayers[player.id])
  };
}

export function getPublicRoomState(
  state: RoomState,
  viewerId: PlayerId | null
): PublicRoomState {
  const players = Object.values(state.players)
    .sort((a, b) => a.joinedAt - b.joinedAt)
    .map((player) => toPublicPlayer(state, player));
  const spectators = Object.values(state.spectators)
    .sort((a, b) => a.joinedAt - b.joinedAt)
    .map((player) => toPublicPlayer(state, player));
  const leaderboard = [...players].sort(
    (a, b) => b.score - a.score || b.roundScore - a.roundScore || a.joinedAt - b.joinedAt
  );
  const readyCount = activeRoundPlayerIds(state).filter((id) => state.readyPlayers[id]).length;
  const currentMatchupResult =
    state.phase === "matchup_result"
      ? state.matchupResults[state.votingOrder[state.currentVoteIndex]]
      : undefined;
  const revealCard = state.phase === "matchup_result" || Boolean(currentMatchupResult);

  return {
    roomCode: state.roomCode,
    hostId: state.hostId,
    phase: state.phase,
    selfId: viewerId,
    isSpectator: Boolean(viewerId && state.spectators[viewerId]),
    players,
    spectators,
    settings: state.settings,
    roundNumber: state.roundNumber,
    writingEndsAt: state.writingEndsAt,
    votingEndsAt: state.votingEndsAt,
    readyCount,
    activeCount: state.matchups.length ? activeRoundPlayerIds(state).length : players.length,
    minPlayers: MIN_PLAYERS,
    currentVoteIndex: state.currentVoteIndex,
    votingTotal: state.votingOrder.length,
    currentVotingCard:
      state.phase === "voting" || state.phase === "matchup_result"
        ? getVotingCard(state, viewerId, revealCard)
        : undefined,
    currentMatchupResult,
    roundScores: state.roundScores,
    totalScores: state.totalScores,
    leaderboard,
    roundStats: state.roundStats,
    finalRoundReached:
      state.settings.roundsToPlay !== null && state.roundNumber >= state.settings.roundsToPlay,
    updatedAt: state.updatedAt
  };
}

export function normalizeSubmittedDefense(text: string | undefined, maxChars: number): string {
  const normalized = clampDefense(text ?? "", maxChars);
  return normalized.length ? normalized : DEFAULT_DEFENSE;
}

export function promoteDraftsAndStartVoting(state: RoomState, now = Date.now()): RoomState {
  const submissions = { ...state.submissions };
  for (const matchup of state.matchups) {
    submissions[matchup.id] = {
      ...(submissions[matchup.id] ?? {}),
      [matchup.playerA]: normalizeSubmittedDefense(
        submissions[matchup.id]?.[matchup.playerA] ?? state.drafts[matchup.playerA]?.[matchup.id],
        state.settings.maxDefenseChars
      ),
      [matchup.playerB]: normalizeSubmittedDefense(
        submissions[matchup.id]?.[matchup.playerB] ?? state.drafts[matchup.playerB]?.[matchup.id],
        state.settings.maxDefenseChars
      )
    };
  }
  return {
    ...state,
    phase: "voting",
    submissions,
    writingEndsAt: undefined,
    votingEndsAt: now + state.settings.votingSeconds * 1000,
    updatedAt: now
  };
}

export function closeCurrentVote(state: RoomState, now = Date.now()): RoomState {
  const matchup = currentMatchup(state);
  if (!matchup) return finishRound(state, now);
  const topic = TOPICS.find((candidate) => candidate.id === matchup.topicId);
  if (!topic) return finishRound(state, now);
  const result = scoreMatchup({
    matchup,
    topic,
    players: state.players,
    submissions: state.submissions[matchup.id] ?? {},
    votes: state.votes[matchup.id] ?? {}
  });
  const scored = applyMatchupScore(state, result);
  return {
    ...scored,
    phase: "matchup_result",
    votingEndsAt: undefined,
    matchupResultEndsAt: now + MATCHUP_RESULT_SECONDS * 1000,
    updatedAt: now
  };
}

export function advanceAfterMatchupResult(state: RoomState, now = Date.now()): RoomState {
  const nextIndex = state.currentVoteIndex + 1;
  if (nextIndex >= state.votingOrder.length) {
    return finishRound(state, now);
  }
  return {
    ...state,
    phase: "voting",
    currentVoteIndex: nextIndex,
    votingEndsAt: now + state.settings.votingSeconds * 1000,
    matchupResultEndsAt: undefined,
    updatedAt: now
  };
}

export function finishRound(state: RoomState, now = Date.now()): RoomState {
  const withStats = { ...state, roundStats: computeRoundStats(state) };
  return {
    ...withStats,
    phase: "round_result",
    votingEndsAt: undefined,
    matchupResultEndsAt: undefined,
    updatedAt: now
  };
}

export function restartRoom(state: RoomState, now = Date.now()): RoomState {
  return {
    ...state,
    phase: "lobby",
    roundNumber: 0,
    writingEndsAt: undefined,
    votingEndsAt: undefined,
    matchupResultEndsAt: undefined,
    matchups: [],
    votingOrder: [],
    currentVoteIndex: 0,
    submissions: {},
    drafts: {},
    readyPlayers: {},
    votes: {},
    matchupResults: {},
    roundScores: {},
    totalScores: {},
    roundStats: {},
    updatedAt: now
  };
}
