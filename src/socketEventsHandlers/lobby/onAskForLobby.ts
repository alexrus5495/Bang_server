import { Socket } from "socket.io";
import { SocketEvents } from "../../socket-events.js";
import { lobbyManager } from "../../lib/LobbyManager.js";

export function onAskForLobby(this: Socket, lobbyId: string) {
  const lobby = lobbyManager.lobbies[lobbyId];

  let result: string;

  if (!lobby) result = "none";
  else if (lobby.isPrivate) result = "private";
  else result = "public";

  this.emit(SocketEvents.ANSWER_ASK_FOR_LOBBY, result);
}
