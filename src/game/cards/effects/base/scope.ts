import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";

export function SCOPE(game: Game, player: Player, cardId: string) {
  if (!cardId.startsWith("scope_")) throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [SCOPE]`);

  const playersScope = game.SC.player._findEquipmentCardIndex(player, "scope");

  if (playersScope) {
    game.SC.player.removeEquipmentCard(playersScope, player);
  }

  game.SC.player.addCardToEquipment(player, cardId);
}
