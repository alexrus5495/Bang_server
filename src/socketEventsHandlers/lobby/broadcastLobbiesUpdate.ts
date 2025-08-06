import { lobbyManager } from "../../lib/LobbyManager.js";
import { io } from "../../server.js";
import { SocketEvents } from "../../socket-events.js";

export function broadcastLobbiesUpdate() {
  const publicLobbies = Object.values(lobbyManager.lobbies).map((lobby) => {
    if (lobby.status === "waiting") return lobby.publicData;
  });

  io.to("LOBBY_SUBSCRIBERS").emit(SocketEvents.LOBBY_UPDATE, publicLobbies);

  console.log("Lobbies broadcasted");
  console.log(publicLobbies);
}
