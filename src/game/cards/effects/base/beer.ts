import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";

export function BEER(game: Game, player: Player, cardId: string) {
  console.log(`${player.nickname} plays [BEER]`);

  const healingAmount = game.validator.getHealingAmount(player);

  if (!healingAmount) throw new Error("Failed to get healing amount");

  if (game.validator.playersActive <= 2) {
    console.log("[BEER] has no effect!");
  } else {
    game.SC.player.heal(player, healingAmount);
  }
}
