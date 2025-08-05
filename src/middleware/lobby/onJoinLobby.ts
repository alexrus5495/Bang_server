import { Socket } from "socket.io";
import { broadcastLobbiesUpdate, getLobbyById } from "../../lib/lobbies.js";
import { io } from "../../server.js";
import { SocketEvents } from "../../socket-events.js";

export function onJoinLobby(
  this: Socket,
  lobbyId: string,
  playerData: { playerName: string; playerId: string },
  password?: string,
) {
  console.log(`LobbyID: ${lobbyId}`);

  const lobby = getLobbyById(lobbyId);

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
