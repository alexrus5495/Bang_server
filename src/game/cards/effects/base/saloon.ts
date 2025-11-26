import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";

export function SALOON(game: Game, player: Player, cardId: string) {
  console.log(`${player.nickname} plays [SALOON]`);

  const activePlayers = game.StateController.player.getActivePlayers();

  for (const player of activePlayers) {
    const healingAmount = game.validator.getHealingAmount(player) as number;
    game.StateController.player.heal(player, healingAmount);
    console.log(`${player.nickname} restores ${healingAmount} HP`);
  }
}
