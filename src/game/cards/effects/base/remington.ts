import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";
import { equipWeaponEffect } from "../helpers.js";

export function REMINGTON(game: Game, player: Player, cardId: string) {
  if (!cardId.startsWith("remington_"))
    throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [REMINGTON]`);
  equipWeaponEffect(game, player, cardId, "remington_");
}
