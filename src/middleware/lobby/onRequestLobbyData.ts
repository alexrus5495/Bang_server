import { Socket } from "socket.io";
import { getLobbyById } from "../../lib/lobbies.js";
import { SocketEvents } from "../../socket-events.js";

export function onRequestLobbydata(this: Socket, lobbyId: string) {
  const lobby = getLobbyById(lobbyId);

  if (!lobby) {
    console.log("Failed to get lobby data");
    return;
  }

  this.emit(SocketEvents.SEND_LOBBY_DATA, lobby.publicData);
}
