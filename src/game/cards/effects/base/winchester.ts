import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";

export function WINCHESTER(game: Game, player: Player, cardId: string) {
  if (!cardId.startsWith("winchester_"))
    throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [WINCHESTER]`);

  const playersWeapon = game.StateController.player.getCurrentWeaponIndex(player);

  if (playersWeapon) {
    game.StateController.player.removeEquipmentCard(playersWeapon, player);
  }

  game.StateController.player.addCardToEquipment(player, cardId);
}
