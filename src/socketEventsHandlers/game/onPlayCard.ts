import { Socket } from "socket.io";
import { lobbyManager } from "../../lib/LobbyManager.js";
import { SocketEvents } from "../../socket-events.js";
import { CardValidationData } from "../../types.js";

type AckCallback = (response: { success: boolean; error?: string }) => void;

type PlayCardData = {
  gameId: string;
  cardIndex: number;
  targetId?: string;
};

export async function onPlayCard(
  this: Socket,
  data: PlayCardData,
  ack?: AckCallback,
) {
  const game = lobbyManager.getGameById(data.gameId);
  if (!game) {
    console.log(`failed to get the game`);
    ack?.({ success: false, error: "Game not found" });
    return;
  }

  const player = game.stateCtrl.playerCtrl.getPlayerById(this.id);
  if (!player) {
    console.log(`failed to get the player`);
    ack?.({ success: false, error: "Player not found" });
    return;
  }

  console.log(`Trying to play card ${data.cardIndex}`);

  let canPlay: boolean;

  if (!data.targetId) {
    canPlay = game.validator.isCardAllowedToPlay(data.cardIndex, player);
  } else {
    const targetPlayer = game.stateCtrl.playerCtrl.getPlayerById(data.targetId);
    canPlay = game.validator.isCardAllowedToPlay(
      data.cardIndex,
      player,
      targetPlayer,
    );
  }

  if (!canPlay) {
    ack?.({ success: false, error: "Card cannot be played" });
    return;
  }

  ack?.({ success: true });
  console.log(`calling playCard on card with index ${data.cardIndex}`);

  if (data.targetId) {
    const targetPlayer = game.stateCtrl.playerCtrl.getPlayerById(data.targetId);
    game.cardsDispatcher.playCard(data.cardIndex, player, targetPlayer);
  } else {
    game.cardsDispatcher.playCard(data.cardIndex, player);
  }

  //Update hand validation data
  const validationResult: CardValidationData[] | null =
    game.validator.validateHand(player);

  this.emit(SocketEvents.SEND_HAND_VALIDATION_DATA, validationResult);
}
