"use client";

import { nanoid } from "nanoid";
import { ROOM_CODE_ALPHABET } from "@/lib/constants";
import { sampleRoomCode } from "@/lib/shuffle";

export const SESSION_ID_KEY = "takeups.sessionId";
export const DISPLAY_NAME_KEY = "takeups.displayName";
export const SOUND_MUTED_KEY = "takeups.soundMuted";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return `s_${nanoid(16)}`;
  const existing = window.localStorage.getItem(SESSION_ID_KEY);
  if (existing) return existing;
  const created = `s_${nanoid(18)}`;
  window.localStorage.setItem(SESSION_ID_KEY, created);
  return created;
}

export function getStoredDisplayName(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(DISPLAY_NAME_KEY) ?? "";
}

export function storeDisplayName(name: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(DISPLAY_NAME_KEY, name);
  }
}

export function getSoundMuted(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(SOUND_MUTED_KEY) === "true";
}

export function setSoundMuted(muted: boolean) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SOUND_MUTED_KEY, String(muted));
  }
}

export function getPartyHost(): string {
  return process.env.NEXT_PUBLIC_PARTYKIT_HOST || "takeups.osamamit.partykit.dev";
}

export function createClientRoomCode(): string {
  return sampleRoomCode(6, ROOM_CODE_ALPHABET);
}
