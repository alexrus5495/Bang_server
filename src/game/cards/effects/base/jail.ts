import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";

export function JAIL(
  game: Game,
  player: Player,
  targetPlayer: Player,
  cardId: string,
) {
  if (!cardId.startsWith("jail_")) throw new Error("Got unexpected cardId");

  console.log(
    `${player.nickname} plays [JAIL] againg ${targetPlayer.nickname}`,
  );

  game.StateController.player.addCardToEquipment(targetPlayer, cardId);
}
