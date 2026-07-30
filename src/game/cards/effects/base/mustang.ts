import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";
import { equipCardEffect } from "../helpers.js";

export function MUSTANG(game: Game, player: Player, cardId: string) {
  if (!cardId.startsWith("mustang_")) throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [MUSTANG]`);

  equipCardEffect(game, player, cardId, "mustang_");
}
