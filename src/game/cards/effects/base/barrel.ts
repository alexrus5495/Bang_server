import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";

export function BARREL(game: Game, player: Player, cardId: string) {
  if (!cardId.startsWith("barrel_")) throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [BARREL]`);

  const playersBarrel = game.StateController.player.getEquipmentCardIndex(
    player,
    "barrel",
  );

  if (playersBarrel) {
    game.StateController.player.removeEquipmentCard(playersBarrel, player);
  }

  game.StateController.player.addCardToEquipment(player, cardId);
}
