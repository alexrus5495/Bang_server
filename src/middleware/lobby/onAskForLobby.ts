import { Socket } from "socket.io";
import { getLobbyById } from "../../lib/lobbies.js";
import { SocketEvents } from "../../socket-events.js";

export function onAskForLobby(this: Socket, lobbyId: string) {
  const lobby = getLobbyById(lobbyId);

  let result: string;

  if (!lobby) result = "none";
  else if (lobby.isPrivate) result = "private";
  else result = "public";

  this.emit(SocketEvents.ANSWER_ASK_FOR_LOBBY, result);
}
