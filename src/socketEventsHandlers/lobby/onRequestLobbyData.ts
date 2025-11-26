import { Socket } from "socket.io";
import { SocketEvents } from "../../socket-events.js";
import { lobbyManager } from "../../lib/LobbyManager.js";

export function onRequestLobbydata(this: Socket, lobbyId: string) {
  const lobby = lobbyManager.lobbies[lobbyId];

  if (!lobby) {
    console.log("Failed to get lobby data");
    return;
  }

  this.emit(SocketEvents.SEND_LOBBY_DATA, lobby.publicData);
}
