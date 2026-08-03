import { Socket } from "socket.io";
import { lobbyManager } from "../../lib/LobbyManager.js";
import { CardValidationData } from "../../types.js";
import { SocketEvents } from "../../socket-events.js";

export function onRequestHandValidation(this: Socket) {
  const game = lobbyManager.getLobbyByPlayerId(this.id)?.game;
  if (!game) return;

  const player = game.stateCtrl.playerCtrl.getPlayerById(this.id);
  if (!player) return;

  const validationResult: CardValidationData[] | null =
    game.validator.validateHand(player);

  this.emit(SocketEvents.SEND_HAND_VALIDATION_DATA, validationResult);
}
