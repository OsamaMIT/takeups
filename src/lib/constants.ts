import type { RoomSettings } from "@/types/game";

export const STORAGE_KEY = "room-state-v1";
export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 12;
export const MAX_SPECTATORS = 24;
export const DEFAULT_DEFENSE = "DEFENSE NOT FILED.";
export const MATCHUP_RESULT_SECONDS = 5;
export const ROOM_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const PLAYER_COLORS = [
  "#4F8CFF",
  "#FF4F6D",
  "#F5C451",
  "#57E389",
  "#B98CFF",
  "#55D6FF",
  "#FF9F4F",
  "#B6F56C",
  "#FF76CA",
  "#7DFFDE",
  "#D2D8EA",
  "#A7B0C8"
];

export const DEFAULT_SETTINGS: RoomSettings = {
  writingSeconds: 120,
  votingSeconds: 20,
  maxDefenseChars: 200,
  roundsToPlay: 5,
  anonymousVoting: true,
  allowSpectators: true,
  allowLateJoin: true,
  topicPacks: [
    "Absurd Everyday Takes",
    "Food Crimes",
    "Social Etiquette",
    "Pop Culture Logic",
    "Tech & Internet",
    "School / Work Chaos",
    "Philosophical Nonsense",
    "Spicy But Safe"
  ],
  intensity: "absurd"
};
