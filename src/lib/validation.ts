import { z } from "zod";
import { DEFAULT_SETTINGS, MAX_CUSTOM_TOPICS, MAX_PLAYERS, MAX_SPECTATORS } from "@/lib/constants";
import type { CustomTopic } from "@/types/game";

export const nameSchema = z
  .string()
  .trim()
  .min(1, "Display name is required")
  .max(24, "Display name must be 24 characters or fewer")
  .transform((value) => sanitizeName(value));

export const roomCodeSchema = z
  .string()
  .trim()
  .min(3)
  .max(12)
  .transform((value) => value.toUpperCase().replace(/[^A-Z0-9]/g, ""));

export const settingsSchema = z.object({
  writingSeconds: z.number().int().min(30).max(300).default(DEFAULT_SETTINGS.writingSeconds),
  votingSeconds: z.number().int().min(10).max(60).default(DEFAULT_SETTINGS.votingSeconds),
  maxDefenseChars: z.number().int().min(80).max(280).default(DEFAULT_SETTINGS.maxDefenseChars),
  roundsToPlay: z.number().int().min(1).max(12).nullable().default(DEFAULT_SETTINGS.roundsToPlay),
  anonymousVoting: z.boolean().default(DEFAULT_SETTINGS.anonymousVoting),
  allowSpectators: z.boolean().default(DEFAULT_SETTINGS.allowSpectators),
  allowLateJoin: z.boolean().default(DEFAULT_SETTINGS.allowLateJoin),
  topicPacks: z.array(z.string()).min(1).default(DEFAULT_SETTINGS.topicPacks),
  customTopics: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(80),
        prompt: z.string().trim().min(3).max(140),
        sideA: z.string().trim().min(1).max(120),
        sideB: z.string().trim().min(1).max(120)
      })
    )
    .max(MAX_CUSTOM_TOPICS)
    .default(DEFAULT_SETTINGS.customTopics),
  intensity: z.enum(["spicy", "absurd"]).default(DEFAULT_SETTINGS.intensity)
});

export const partialSettingsSchema = settingsSchema.partial();

export const clientMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("join_room"),
    name: nameSchema,
    sessionId: z.string().trim().min(8).max(80).optional()
  }),
  z.object({ type: z.literal("start_round") }),
  z.object({
    type: z.literal("update_draft"),
    matchupId: z.string().min(1).max(80),
    text: z.string().max(1000)
  }),
  z.object({
    type: z.literal("submit_defenses"),
    defenses: z.record(z.string().min(1).max(80), z.string().max(1000))
  }),
  z.object({ type: z.literal("ready") }),
  z.object({ type: z.literal("unready") }),
  z.object({
    type: z.literal("vote"),
    matchupId: z.string().min(1).max(80),
    votedFor: z.string().min(1).max(80)
  }),
  z.object({ type: z.literal("next_round") }),
  z.object({
    type: z.literal("update_settings"),
    settings: partialSettingsSchema
  }),
  z.object({
    type: z.literal("kick_player"),
    playerId: z.string().min(1).max(80)
  }),
  z.object({ type: z.literal("restart_game") })
]);

export function sanitizeName(value: string): string {
  return value
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 24);
}

export function clampDefense(text: string, maxChars: number): string {
  return text.replace(/\s+/g, " ").trim().slice(0, maxChars);
}

export function sanitizeTopicText(value: string, maxChars: number): string {
  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, maxChars);
}

export function normalizeCustomTopics(topics: readonly CustomTopic[] | undefined): CustomTopic[] {
  const seen = new Set<string>();
  const normalized: CustomTopic[] = [];

  for (const topic of topics ?? []) {
    if (normalized.length >= MAX_CUSTOM_TOPICS) break;
    const prompt = sanitizeTopicText(topic.prompt, 140);
    const sideA = sanitizeTopicText(topic.sideA, 120);
    const sideB = sanitizeTopicText(topic.sideB, 120);
    if (prompt.length < 3 || !sideA || !sideB) continue;

    const baseId =
      sanitizeTopicText(topic.id, 80)
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-|-$/g, "") || `custom-${normalized.length + 1}`;
    let id = baseId;
    let suffix = 2;
    while (seen.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }
    seen.add(id);
    normalized.push({ id, prompt, sideA, sideB });
  }

  return normalized;
}

export function validateRoomCapacity(players: number, spectators: number): boolean {
  return players <= MAX_PLAYERS && spectators <= MAX_SPECTATORS;
}
