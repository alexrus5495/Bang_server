import type { EventType } from "../eventSystem/types.js";

export function createAckKey(
  eventType: keyof EventType,
  playerId: string,
): string {
  return `${eventType}:${playerId}`;
}
