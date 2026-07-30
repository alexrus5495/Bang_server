import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";
import { equipWeaponEffect } from "../helpers.js";

export function SCHOFIELD(game: Game, player: Player, cardId: string) {
  if (!cardId.startsWith("schofield_"))
    throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [SCHOFIELD]`);

  equipWeaponEffect(game, player, cardId, "schofield_");
}
