import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";

export function BARREL(game: Game, player: Player, cardId: string) {
  if (!cardId.startsWith("barrel_")) throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [BARREL]`);

  const playersBarrel = game.SC.player._findEquipmentCardIndex(
    player,
    "barrel",
  );

  if (playersBarrel) {
    game.SC.player.removeEquipmentCard(playersBarrel, player);
  }

  game.SC.player.addCardToEquipment(player, cardId);
}
