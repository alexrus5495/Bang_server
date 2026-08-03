import { Socket } from "socket.io";
import { lobbyManager } from "../../lib/LobbyManager.js";
import { CardValidationData } from "../../types.js";
import { SocketEvents } from "../../socket-events.js";

export function onDevAddToHand(this: Socket, cardId: string) {
  console.log(`got devAddToHand with cardId: ${cardId}`);
  const game = lobbyManager.getLobbyByPlayerId(this.id)?.game;
  if (!game) return;

  const player = game.stateCtrl.playerCtrl.getPlayerById(this.id);
  if (!player) return;

  game.stateCtrl.playerCtrl.addCardsToTheHand(player, [cardId]);

  const validationResult: CardValidationData[] | null =
    game.validator.validateHand(player);

  this.emit(SocketEvents.SEND_HAND_VALIDATION_DATA, validationResult);
}
