import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";

export function STAGECOACH(game: Game, player: Player, cardId: string) {
  if (!cardId.startsWith("stagecoach_"))
    throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [STAGECOACH]`);

  game.StateController.cards.drawToHand(player, 2);
  game.EventSystem.card.tableCleared();
}
