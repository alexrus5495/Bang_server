import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";
import { equipWeaponEffect } from "../helpers.js";

export function WINCHESTER(game: Game, player: Player, cardId: string) {
  if (!cardId.startsWith("winchester_"))
    throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [WINCHESTER]`);

  equipWeaponEffect(game, player, cardId, "winchester_");
}
