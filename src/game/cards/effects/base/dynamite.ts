import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";

export function DYNAMITE(game: Game, player: Player, cardId: string) {
  if (!cardId.startsWith("dynamite_")) throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [DYNAMITE]`);

  game.StateController.player.addCardToEquipment(player, cardId);
}
