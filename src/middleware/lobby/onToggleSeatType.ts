import { Socket } from "socket.io";
import { getLobbyById } from "../../lib/lobbies.js";
import { io } from "../../server.js";
import { SocketEvents } from "../../socket-events.js";

export function onToggleSeatType(
  this: Socket,
  seatId: number,
  lobbyId: string,
) {
  console.log("calle toggle seat type");

  const lobby = getLobbyById(lobbyId);
  if (!lobby) return;

  const seat = lobby?.seats[seatId];
  if (!seat) return;

  lobby.switchSeatType(seat);

  io.to(lobbyId).emit(SocketEvents.LOBBY_UPDATE, lobby.publicData);
}
