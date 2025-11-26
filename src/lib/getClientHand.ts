import { Game } from "../game/engine/core/game.js";

export function getClientHand(clientId: string, game: Game) {
  const clientPlayer = game.StateController.player.getPlayerById(clientId);
  if (!clientPlayer) return;

  return clientPlayer.hand;
}
