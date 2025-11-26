import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";

export function WELLS_FARGO(game: Game, player: Player, cardId: string) {
  game.StateController.cards.drawToHand(player, 3);
}
