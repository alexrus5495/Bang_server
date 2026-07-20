import { Socket } from "socket.io";
import { lobbyManager } from "../../lib/LobbyManager.js";

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

  const player = game.StateController.player.getPlayerById(this.id);
  if (!player) {
    console.log(`failed to get the player`);
    ack?.({ success: false, error: "Player not found" });
    return;
  }

  let canPlay: boolean;

  if (!data.targetId) {
    canPlay = game.validator.isCardAllowedToPlay(data.cardIndex, player);
  } else {
    const targetPlayer = game.StateController.player.getPlayerById(
      data.targetId,
    );
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
  game.CEF.playCard(data.cardIndex, player);
}
