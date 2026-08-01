import { Socket } from "socket.io";
import { lobbyManager } from "../../lib/LobbyManager.js";
import { CardValidationData } from "../../types.js";
import { SocketEvents } from "../../socket-events.js";

export function onDevDamagePlayer(this: Socket, payload: { playerId: string }) {
  const game = lobbyManager.getLobbyByPlayerId(this.id)?.game;
  if (!game) return;

  const player = game.StateController.player.getPlayerById(payload.playerId);
  if (!player) return;

  player.takeDamage(1);
  const validationResult: CardValidationData[] | null =
    game.validator.validateHand(player);

  this.emit(SocketEvents.SEND_HAND_VALIDATION_DATA, validationResult);
}
