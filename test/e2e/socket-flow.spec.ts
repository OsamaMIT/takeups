import { expect, test } from "@playwright/test";
import type { Assignment, PublicRoomState, ServerMessage } from "../../src/types/game";

type AuditClient = {
  name: string;
  sessionId: string;
  socket: WebSocket;
  states: PublicRoomState[];
  assignments: Assignment[];
  messages: ServerMessage[];
  send: (message: unknown) => void;
  waitForState: (
    predicate: (state: PublicRoomState) => boolean,
    timeoutMs?: number
  ) => Promise<PublicRoomState>;
  waitForAssignments: (
    predicate: (assignments: Assignment[]) => boolean,
    timeoutMs?: number
  ) => Promise<Assignment[]>;
  latestState: () => PublicRoomState;
  close: () => Promise<void>;
};

const SOCKET_TIMEOUT = 12_000;

test.skip(({ isMobile }) => Boolean(isMobile), "Socket-only flow runs once.");
test.setTimeout(120_000);

test("authoritative PartyKit room flow keeps hidden state private", async () => {
  const roomCode = `AUD${Date.now().toString(36).toUpperCase()}`;
  const alpha = await connectClient(roomCode, "Alpha", "session-alpha");
  const bravo = await connectClient(roomCode, "Bravo", "session-bravo");
  const charlie = await connectClient(roomCode, "Charlie", "session-charlie");

  await Promise.all([
    alpha.waitForState((state) => state.players.length === 3 && state.hostId === state.selfId),
    bravo.waitForState((state) => state.players.length === 3),
    charlie.waitForState((state) => state.players.length === 3)
  ]);

  const originalHostId = alpha.latestState().selfId;
  expect(originalHostId).toBeTruthy();
  alpha.send({ type: "start_round" });

  await Promise.all([
    alpha.waitForAssignments((assignments) => assignments.length === 2),
    bravo.waitForAssignments((assignments) => assignments.length === 2),
    charlie.waitForAssignments((assignments) => assignments.length === 2)
  ]);

  for (const client of [alpha, bravo, charlie]) {
    const state = client.latestState();
    expect(state.phase).toBe("writing");
    expect(client.assignments).toHaveLength(2);
    assertPublicStateDoesNotLeakHiddenData(state);
  }

  // Late join during a round should be spectator-only until the next round.
  const delta = await connectClient(roomCode, "Delta", "session-delta");
  await delta.waitForState((state) => state.isSpectator && state.phase === "writing");
  expect(delta.assignments).toHaveLength(0);

  for (const client of [alpha, bravo, charlie]) {
    client.send({
      type: "submit_defenses",
      defenses: Object.fromEntries(
        client.assignments.map((assignment, index) => [
          assignment.matchupId,
          `${client.name} defense ${index + 1}`
        ])
      )
    });
  }

  await Promise.all([
    alpha.waitForState((state) => state.phase === "voting"),
    bravo.waitForState((state) => state.phase === "voting"),
    charlie.waitForState((state) => state.phase === "voting")
  ]);

  const seenMatchups = new Set<string>();
  const activeClients = [alpha, bravo, charlie];
  for (let index = 0; index < 3; index += 1) {
    const votingStates = await Promise.all(
      activeClients.map((client) =>
        client.waitForState(
          (state) =>
            state.phase === "voting" &&
            Boolean(state.currentVotingCard) &&
            !seenMatchups.has(state.currentVotingCard!.matchupId),
          SOCKET_TIMEOUT
        )
      )
    );
    const voters = activeClients
      .map((client, clientIndex) => ({ client, state: votingStates[clientIndex] }))
      .filter(({ state }) => state.currentVotingCard?.canVote);
    expect(voters).toHaveLength(1);

    const { client: voter, state: voterState } = voters[0];
    const card = voterState.currentVotingCard;
    expect(card).toBeTruthy();
    seenMatchups.add(card!.matchupId);

    for (const state of votingStates) {
      const cardForClient = state.currentVotingCard;
      expect(cardForClient).toBeTruthy();
      expect(cardForClient?.matchupId).toBe(card!.matchupId);
      expect(cardForClient?.revealed).toBeUndefined();
      expect(JSON.stringify(cardForClient)).not.toContain("session-");
    }

    const deltaVotingState = await delta.waitForState(
      (state) =>
        state.phase === "voting" &&
        state.currentVotingCard?.matchupId === card!.matchupId,
      SOCKET_TIMEOUT
    );
    expect(deltaVotingState.currentVotingCard?.canVote).toBe(false);
    expect(deltaVotingState.currentVotingCard?.revealed).toBeUndefined();
    expect(JSON.stringify(deltaVotingState.currentVotingCard)).not.toContain("session-");

    voter.send({ type: "vote", matchupId: card!.matchupId, votedFor: card!.optionA });

    const [alphaResultState] = await Promise.all([
      alpha.waitForState(
        (state) => state.phase === "matchup_result" && Boolean(state.currentMatchupResult)
      ),
      bravo.waitForState(
        (state) => state.phase === "matchup_result" && Boolean(state.currentMatchupResult)
      ),
      charlie.waitForState(
        (state) => state.phase === "matchup_result" && Boolean(state.currentMatchupResult)
      )
    ]);

    const result = alphaResultState.currentMatchupResult;
    expect(result).toBeTruthy();
    expect(result?.totalVotes).toBe(1);
    expect((result?.pointsA ?? 0) + (result?.pointsB ?? 0)).toBe(100);
    expect(JSON.stringify(result)).not.toContain("session-");
  }

  expect(seenMatchups.size).toBe(3);
  await Promise.all([
    alpha.waitForState((state) => state.phase === "round_result"),
    bravo.waitForState((state) => state.phase === "round_result"),
    charlie.waitForState((state) => state.phase === "round_result")
  ]);

  const roundResult = alpha.latestState();
  expect(roundResult.leaderboard).toHaveLength(3);
  expect(roundResult.votingTotal).toBe(3);
  assertPublicStateDoesNotLeakHiddenData(roundResult);

  await alpha.close();
  const transferred = await bravo.waitForState(
    (state) => state.hostId !== originalHostId && state.hostId === state.selfId
  );
  expect(transferred.hostId).toBe(bravo.latestState().selfId);

  const alphaReconnect = await connectClient(roomCode, "Alpha", "session-alpha");
  await alphaReconnect.waitForState((state) => state.selfId === originalHostId);
  expect(alphaReconnect.latestState().hostId).toBe(bravo.latestState().selfId);

  bravo.send({ type: "next_round" });
  await Promise.all([
    bravo.waitForState((state) => state.phase === "writing" && state.roundNumber === 2),
    charlie.waitForState((state) => state.phase === "writing" && state.roundNumber === 2),
    delta.waitForState((state) => !state.isSpectator && state.phase === "writing"),
    alphaReconnect.waitForState((state) => state.phase === "writing" && state.roundNumber === 2)
  ]);

  for (const client of [alphaReconnect, bravo, charlie, delta]) {
    await client.waitForAssignments((assignments) => assignments.length === 2);
    expect(client.latestState().players).toHaveLength(4);
    assertPublicStateDoesNotLeakHiddenData(client.latestState());
  }

  await Promise.all([alphaReconnect.close(), bravo.close(), charlie.close(), delta.close()]);
});

function assertPublicStateDoesNotLeakHiddenData(state: PublicRoomState) {
  const serialized = JSON.stringify(state);
  expect(serialized).not.toContain("session-");
  expect(Object.prototype.hasOwnProperty.call(state, "matchups")).toBe(false);
  expect(Object.prototype.hasOwnProperty.call(state, "votingOrder")).toBe(false);
  expect(Object.prototype.hasOwnProperty.call(state, "submissions")).toBe(false);
  expect(Object.prototype.hasOwnProperty.call(state, "drafts")).toBe(false);
  expect(Object.prototype.hasOwnProperty.call(state, "votes")).toBe(false);
}

async function connectClient(roomCode: string, name: string, sessionId: string): Promise<AuditClient> {
  const socket = new WebSocket(`ws://127.0.0.1:1999/parties/main/${roomCode}`);
  const client: AuditClient = {
    name,
    sessionId,
    socket,
    states: [],
    assignments: [],
    messages: [],
    send(message: unknown) {
      socket.send(JSON.stringify(message));
    },
    waitForState(predicate, timeoutMs = SOCKET_TIMEOUT) {
      return waitFor(() => findLatest(client.states, predicate), timeoutMs);
    },
    waitForAssignments(predicate, timeoutMs = SOCKET_TIMEOUT) {
      return waitFor(() => (predicate(client.assignments) ? client.assignments : undefined), timeoutMs);
    },
    latestState() {
      const state = client.states.at(-1);
      if (!state) throw new Error(`${name} has no state yet`);
      return state;
    },
    close() {
      return new Promise<void>((resolve) => {
        if (socket.readyState === WebSocket.CLOSED) {
          resolve();
          return;
        }
        const fallback = setTimeout(() => resolve(), 1_000);
        socket.addEventListener(
          "close",
          () => {
            clearTimeout(fallback);
            resolve();
          },
          { once: true }
        );
        socket.close();
      });
    }
  };

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data)) as ServerMessage;
    client.messages.push(message);
    if (message.type === "snapshot") {
      client.states.push(message.state);
      client.assignments = message.assignments;
      return;
    }
    if (message.type === "state") client.states.push(message.state);
    if (message.type === "private_assignments") client.assignments = message.assignments;
  });

  await new Promise<void>((resolve, reject) => {
    socket.addEventListener("open", () => resolve(), { once: true });
    socket.addEventListener("error", () => reject(new Error(`${name} socket failed`)), { once: true });
  });

  client.send({ type: "join_room", name, sessionId });
  await client.waitForState((state) => Boolean(state.selfId));
  return client;
}

async function waitFor<T>(read: () => T | undefined, timeoutMs: number): Promise<T> {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const value = read();
    if (value !== undefined) return value;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error("Timed out waiting for socket condition");
}

function findLatest<T>(items: T[], predicate: (item: T) => boolean): T | undefined {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (predicate(items[index])) return items[index];
  }
  return undefined;
}
