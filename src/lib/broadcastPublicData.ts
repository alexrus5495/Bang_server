import { io } from "../server.js";
import { SocketEvents } from "../socket-events.js";
import { formPublicData } from "./formPublicData.js";
import { lobbyManager } from "./LobbyManager.js";

export async function broadcastPublicData(id: string) {
  const lobby = lobbyManager.lobbies[id];
  if (!lobby) return;

  const game = lobbyManager.lobbies[id].game;
  if (!game) return;

  const clientsInRoom = await io.in(id).fetchSockets();

  clientsInRoom.forEach((client) => {
    client.emit(SocketEvents.SEND_PUBLIC_DATA, formPublicData(client.id, game));
  });
}
