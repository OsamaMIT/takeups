import { describe, expect, it } from "vitest";
import { generateRound, getSelectedTopics } from "@/lib/game";
import { TOPICS } from "@/lib/topics";
import type { Player, RoomSettings } from "@/types/game";
import { DEFAULT_SETTINGS } from "@/lib/constants";

function makePlayers(count: number): Player[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `p${index}`,
    sessionId: `s${index}`,
    name: `Player ${index}`,
    connected: true,
    isHost: index === 0,
    joinedAt: index,
    color: "#4F8CFF"
  }));
}

describe("generateRound", () => {
  it("creates one hidden-cycle edge per player and two assignments per player", () => {
    const players = makePlayers(6);
    const matchups = generateRound(players, TOPICS, () => 0.42);
    const counts = new Map<string, number>();

    for (const matchup of matchups) {
      counts.set(matchup.playerA, (counts.get(matchup.playerA) ?? 0) + 1);
      counts.set(matchup.playerB, (counts.get(matchup.playerB) ?? 0) + 1);
      expect(matchup.sideByPlayer[matchup.playerA]).not.toEqual(
        matchup.sideByPlayer[matchup.playerB]
      );
      expect(matchup.optionByPlayer[matchup.playerA]).not.toEqual(
        matchup.optionByPlayer[matchup.playerB]
      );
    }

    expect(matchups).toHaveLength(players.length);
    for (const player of players) {
      expect(counts.get(player.id)).toBe(2);
    }
  });

  it("filters topics by selected packs and hierarchical intensity", () => {
    const settings: RoomSettings = {
      ...DEFAULT_SETTINGS,
      topicPacks: ["Food Crimes"],
      intensity: "spicy"
    };
    const selected = getSelectedTopics(settings);
    expect(selected.length).toBeGreaterThan(0);
    expect(selected.every((topic) => topic.pack === "Food Crimes")).toBe(true);
    expect(selected.every((topic) => topic.intensity !== "absurd")).toBe(true);
  });
});
