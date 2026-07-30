import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";
import { equipWeaponEffect } from "../helpers.js";

export function VOLCANIC(game: Game, player: Player, cardId: string) {
  if (!cardId.startsWith("volcanic_")) throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [VOLCANIC]`);

  equipWeaponEffect(game, player, cardId, "volcanic_");
}
