import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";
import { equipWeaponEffect } from "../helpers.js";

export function CARABINE(game: Game, player: Player, cardId: string) {
  if (!cardId.startsWith("carabine_")) throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [REV.CARABINE]`);
  equipWeaponEffect(game, player, cardId, "carabine_");
}
