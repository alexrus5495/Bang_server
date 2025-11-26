import { Socket } from "socket.io";
import { io } from "../../server.js";
import { SocketEvents } from "../../socket-events.js";
import { lobbyManager } from "../../lib/LobbyManager.js";

export function onToggleSeatType(
  this: Socket,
  seatId: number,
  lobbyId: string,
) {
  console.log("calle toggle seat type");

  const lobby = lobbyManager.lobbies[lobbyId];

  if (!lobby) return;

  const seat = lobby?.seats[seatId];
  if (!seat) return;

  lobby.switchSeatType(seat);

  io.to(lobbyId).emit(SocketEvents.LOBBY_UPDATE, lobby.publicData);
}
