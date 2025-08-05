import { Socket } from "socket.io";
import { getLobbyById } from "../../lib/lobbies.js";
import { io } from "../../server.js";
import { SocketEvents } from "../../socket-events.js";

export function onToggleReady(this: Socket, lobbyId: string, seatId: number) {
  const lobby = getLobbyById(lobbyId);

  if (!lobby || !lobby.seats[seatId]) return;

  lobby.seats[seatId].isReady = !lobby.seats[seatId].isReady;

  console.log("Toggled ready");

  io.to(lobbyId).emit(SocketEvents.LOBBY_UPDATE, lobby.publicData);
}
