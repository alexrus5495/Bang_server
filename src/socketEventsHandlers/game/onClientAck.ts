import { Socket } from "socket.io";
import { lobbyManager } from "../../lib/LobbyManager.js";

export function onClientAck(this: Socket, data: { ackKey: string }) {
  const lobby = lobbyManager.getLobbyByPlayerId(this.id);

  if (!lobby || !lobby.game) return;

  const player = lobby.game.stateCtrl.playerCtrl.getPlayerById(this.id);
  if (!player) return;

  lobby.game.runtime.handleClientAck(data.ackKey);
}
