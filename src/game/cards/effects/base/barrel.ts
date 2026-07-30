import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";
import { equipCardEffect } from "../helpers.js";

export function BARREL(game: Game, player: Player, cardId: string) {
  if (!cardId.startsWith("barrel_")) throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [BARREL]`);

  equipCardEffect(game, player, cardId, "barrel_");
}
