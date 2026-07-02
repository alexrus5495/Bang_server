import type { ClientPlayer } from "../types.js";
import type { EventSystem } from "./eventSystem.js";
import type { EventType } from "./types.js";

export class PlayerEvents {
  constructor(private eventSystem: EventSystem) {}

  assignedSlot(
    index: number,
    playerData: Pick<ClientPlayer, "id" | "nickname" | "color" | "isAI">,
  ) {
    this.eventSystem.register("PLAYER_ASSIGNED_SLOT", { index, playerData });
  }

  shuffled(newOrder: string[]) {
    this.eventSystem.register("PLAYERS_SHUFFLED", { newOrder });
  }

  assignedRole(playerId: string, role: string) {
    this.eventSystem.register("PLAYER_ASSIGNED_ROLE", {
      playerId,
      role,
      visibleTo: [playerId],
    });
  }

  assignedChar(
    playerId: string,
    char: string,
    health: EventType["PLAYER_ASSIGNED_CHAR"]["health"],
  ) {
    this.eventSystem.register("PLAYER_ASSIGNED_CHAR", {
      playerId,
      char,
      health,
    });
  }
}
