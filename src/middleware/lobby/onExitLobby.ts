import { Socket } from "socket.io";
import {
  broadcastLobbiesUpdate,
  deleteLobby,
  getLobbyById,
} from "../../lib/lobbies.js";
import { io } from "../../server.js";
import { SocketEvents } from "../../socket-events.js";

export function onExitLobby(this: Socket, lobbyId: string) {
  console.log("Player sent exit lobby");

  const playerId = this.id;

  const lobby = getLobbyById(lobbyId);

  if (!lobby) {
    console.log("Failed to find lobby");

    return;
  }

  lobby.removePlayer(playerId);
  this.leave(lobbyId);
  io.to(lobbyId).emit(SocketEvents.LOBBY_UPDATE, lobby.publicData);

  if (lobby.occupiedHumanSlots === 0) deleteLobby(lobby);

  broadcastLobbiesUpdate();
}
