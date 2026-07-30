import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";

export function WELLS_FARGO(game: Game, player: Player, cardId: string) {
  if (!cardId.startsWith("wells_fargo_"))
    throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [WELLS_FARGO]`);

  game.StateController.cards.drawToHand(player, 3);
  game.EventSystem.card.tableCleared();
}
