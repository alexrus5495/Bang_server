import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";

export function STAGECOACH(game: Game, player: Player, cardId: string) {
  game.StateController.cards.drawToHand(player, 2);
}
