import { Socket } from "socket.io";
import { initializeGame } from "../../game/engine/gameInitializer.js";
import { io } from "../../server.js";
import { SocketEvents } from "../../socket-events.js";
import { lobbyManager } from "../../lib/LobbyManager.js";

export async function onCreateGame(this: Socket, lobbyId: string) {
  const lobby = lobbyManager.lobbies[lobbyId];
  if (!lobby) return;

  const validation = lobbyManager.doPregameValidation(lobby);

  if (!validation.result) return;

  lobby.status = "starting";

  lobby.game = await initializeGame(
    lobby.numberOfSeats,
    lobby.id,
    lobby.eventSystem,
  );

  io.to(lobbyId).emit(SocketEvents.GAME_CREATED);
}
