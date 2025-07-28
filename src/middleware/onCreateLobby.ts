import { Socket } from "socket.io";
import type { LobbyConfig } from "../types.js";
import { Lobby } from "../lobby.js";
import { broadcastLobbiesUpdate, lobbies } from "../lib/lobbies.js";

export function onCreateLobby(this: Socket, data: LobbyConfig) {
  const lobby = new Lobby(this.id, data);

  lobbies[lobby.id] = lobby;

  console.log("Lobby created");

  broadcastLobbiesUpdate();

  console.log(lobbies);
}
