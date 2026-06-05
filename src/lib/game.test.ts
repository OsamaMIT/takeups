import { describe, expect, it } from "vitest";
import { generateRound, getSelectedTopics, selectWeightedTopics } from "@/lib/game";
import { TOPICS } from "@/lib/topics";
import type { Player, RoomSettings } from "@/types/game";
import { CUSTOM_TOPIC_PACK, DEFAULT_SETTINGS } from "@/lib/constants";

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

  it("mixes custom topics into the selected topic pool", () => {
    const settings: RoomSettings = {
      ...DEFAULT_SETTINGS,
      topicPacks: ["Food Crimes"],
      customTopics: [
        {
          id: "custom-chaos",
          prompt: "Should the group chat have a mayor?",
          sideA: "Yes. Chaos needs elected leadership.",
          sideB: "No. The group chat must remain lawless."
        }
      ]
    };
    const selected = getSelectedTopics(settings);
    expect(selected.some((topic) => topic.id === "custom-custom-chaos")).toBe(true);
    expect(selected.find((topic) => topic.id === "custom-custom-chaos")?.pack).toBe(CUSTOM_TOPIC_PACK);
  });

  it("can sample custom topics with a higher weight", () => {
    const selected = selectWeightedTopics(
      [
        { id: "built-a", prompt: "A?", sideA: "Yes", sideB: "No" },
        {
          id: "custom-a",
          prompt: "Custom?",
          sideA: "Yes",
          sideB: "No",
          pack: CUSTOM_TOPIC_PACK
        },
        { id: "built-b", prompt: "B?", sideA: "Yes", sideB: "No" }
      ],
      1,
      () => 0.2,
      (topic) => (topic.pack === CUSTOM_TOPIC_PACK ? 5 : 1)
    );

    expect(selected[0].id).toBe("custom-a");
  });
});
