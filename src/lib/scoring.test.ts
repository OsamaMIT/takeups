import { describe, expect, it } from "vitest";
import { scoreMatchup } from "@/lib/scoring";
import type { Matchup, Player, Topic } from "@/types/game";

const playerA: Player = {
  id: "a",
  sessionId: "sa",
  name: "A",
  connected: true,
  isHost: true,
  joinedAt: 1
};

const playerB: Player = {
  id: "b",
  sessionId: "sb",
  name: "B",
  connected: true,
  isHost: false,
  joinedAt: 2
};

const topic: Topic = {
  id: "cereal-soup",
  prompt: "Is cereal soup?",
  sideA: "Yes. Cereal is soup.",
  sideB: "No. Cereal is not soup."
};

const matchup: Matchup = {
  id: "m1",
  topicId: topic.id,
  playerA: playerA.id,
  playerB: playerB.id,
  sideByPlayer: {
    a: topic.sideA,
    b: topic.sideB
  },
  optionByPlayer: {
    a: "oa",
    b: "ob"
  }
};

describe("scoreMatchup", () => {
  it("awards points from vote ratio", () => {
    const result = scoreMatchup({
      matchup,
      topic,
      players: { a: playerA, b: playerB },
      submissions: { a: "Soup.", b: "No soup." },
      votes: { c: "oa", d: "oa", e: "ob" }
    });

    expect(result.percentA).toBe(67);
    expect(result.percentB).toBe(33);
    expect(result.pointsA).toBe(67);
    expect(result.pointsB).toBe(33);
    expect(result.winnerId).toBe("a");
  });

  it("splits zero-vote matchups evenly", () => {
    const result = scoreMatchup({
      matchup,
      topic,
      players: { a: playerA, b: playerB },
      submissions: { a: "Soup.", b: "No soup." },
      votes: {}
    });

    expect(result.percentA).toBe(50);
    expect(result.percentB).toBe(50);
    expect(result.pointsA).toBe(50);
    expect(result.pointsB).toBe(50);
    expect(result.winnerId).toBeNull();
  });
});
