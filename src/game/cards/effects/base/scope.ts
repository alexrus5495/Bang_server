import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";
import { equipCardEffect } from "../helpers.js";

export function SCOPE(game: Game, player: Player, cardId: string) {
  if (!cardId.startsWith("scope_")) throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [SCOPE]`);

  equipCardEffect(game, player, cardId, "scope_");
}
