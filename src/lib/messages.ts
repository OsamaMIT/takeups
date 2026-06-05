import type { ClientMessage } from "@/types/game";

export function encodeMessage(message: ClientMessage): string {
  return JSON.stringify(message);
}
