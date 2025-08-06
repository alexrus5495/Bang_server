import { Socket } from "socket.io";
import { io } from "../../server.js";
import { SocketEvents } from "../../socket-events.js";
import { lobbyManager } from "../../lib/LobbyManager.js";

export function onToggleReady(this: Socket, lobbyId: string, seatId: number) {
  const lobby = lobbyManager.getLobbyById(lobbyId);

  if (!lobby || !lobby.seats[seatId]) return;

  lobby.seats[seatId].isReady = !lobby.seats[seatId].isReady;

  console.log("Toggled ready");

  io.to(lobbyId).emit(SocketEvents.LOBBY_UPDATE, lobby.publicData);
}
