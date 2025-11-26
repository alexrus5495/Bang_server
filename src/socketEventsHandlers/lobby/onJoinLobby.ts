import { Socket } from "socket.io";
import { io } from "../../server.js";
import { SocketEvents } from "../../socket-events.js";
import { lobbyManager } from "../../lib/LobbyManager.js";
import { broadcastLobbiesUpdate } from "./broadcastLobbiesUpdate.js";

export function onJoinLobby(
  this: Socket,
  lobbyId: string,
  playerData: { playerName: string; playerId: string },
  password?: string,
) {
  const lobby = lobbyManager.lobbies[lobbyId];

  if (!lobby) {
    console.log("Failed to add player to the lobby");
    return;
  }

  if (lobby.isPrivate) {
    const isPasswordCorrect = lobby.password === password;
    this.emit(SocketEvents.ANSWER_TEST_PASSWORD, isPasswordCorrect);
    if (!isPasswordCorrect) return;
  }

  lobby.addPlayer(playerData);
  this.join(lobbyId);
  io.to(lobbyId).emit(SocketEvents.LOBBY_UPDATE, lobby.publicData);
  broadcastLobbiesUpdate();
}
