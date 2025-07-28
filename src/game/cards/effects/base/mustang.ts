import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";

export function MUSTANG(game: Game, player: Player, cardId: string) {
  if (!cardId.startsWith("mustang_")) throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [MUSTANG]`);

  const playersMustang = game.SC.player._findEquipmentCardIndex(
    player,
    "mustang",
  );

  if (playersMustang) {
    game.SC.player.removeEquipmentCard(playersMustang, player);
  }

  game.SC.player.addCardToEquipment(player, cardId);
}
