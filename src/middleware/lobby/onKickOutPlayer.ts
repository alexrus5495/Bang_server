import { Socket } from "socket.io";
import { getLobbyById } from "../../lib/lobbies.js";
import { io } from "../../server.js";
import { SocketEvents } from "../../socket-events.js";

export function onKickOutPlayer(this: Socket, lobbyId: string, seatId: number) {
  const lobby = getLobbyById(lobbyId);
  if (!lobby) return;

  const seatToClear = lobby?.seats[seatId];
  const kickedPlayerId = seatToClear.playerId;

  if (!seatToClear || !kickedPlayerId) return;

  lobby.freeSeat(seatToClear);
  io.to(kickedPlayerId).emit(SocketEvents.KICKED_OUT);

  io.to(lobbyId).emit(SocketEvents.LOBBY_UPDATE, lobby.publicData);
}
