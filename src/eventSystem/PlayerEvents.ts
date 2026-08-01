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

  healed({
    playerId,
    amount,
    newHealth,
  }: {
    playerId: string;
    amount: number;
    newHealth: number;
  }) {
    this.eventSystem.register("PLAYER_HEALED", { playerId, amount, newHealth });
  }

  damaged({
    playerId,
    amount,
    newHealth,
  }: {
    playerId: string;
    amount: number;
    newHealth: number;
  }) {
    this.eventSystem.register("PLAYER_DAMAGED", {
      playerId,
      amount,
      newHealth,
    });
  }

  eliminated(playerId: string) {
    this.eventSystem.register("PLAYER_ELIMINATED", { playerId });
  }

  massHeal(
    targets: Array<{ playerId: string; amount: number; newHealth: number }>,
  ) {
    this.eventSystem.register("MASS_PLAYER_HEALED", { targets });
  }
}
