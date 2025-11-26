import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";

export function VOLCANIC(game: Game, player: Player, cardId: string) {
  if (!cardId.startsWith("volcanic_")) throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [VOLCANIC]`);

  const playersWeapon = game.StateController.player.getCurrentWeaponIndex(player);

  if (playersWeapon) {
    game.StateController.player.removeEquipmentCard(playersWeapon, player);
  }

  game.StateController.player.addCardToEquipment(player, cardId);
}
