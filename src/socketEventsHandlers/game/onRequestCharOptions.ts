import { Socket } from "socket.io";
import { lobbyManager } from "../../lib/LobbyManager.js";
import { SocketEvents } from "../../socket-events.js";

export async function onRequestCharOptions(this: Socket) {
  const MAX_RETRIES = 5;
  const RETRY_DELAY_MS = 200;

  try {
    const game = lobbyManager.getLobbyByPlayerId(this.id)?.game;
    if (!game) {
      return;
    }

    const player = game.StateController.player.getPlayerById(this.id);
    if (!player) {
      return;
    }

    let charOptions: any[] = [];
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
      charOptions = player.charOptions || [];

      if (charOptions.length > 0) {
        break;
      }

      if (attempts < MAX_RETRIES - 1) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }

      attempts++;
    }

    this.emit(SocketEvents.SEND_CHAR_OPTIONS, charOptions);
  } catch (error) {
    console.error("Failed to get charOptions:", error);
  }
}
