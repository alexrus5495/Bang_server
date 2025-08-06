import { Socket } from "socket.io";
import { Lobby } from "../../lobby.js";
import { lobbyManager } from "../../lib/LobbyManager.js";
import { SocketEvents } from "../../socket-events.js";
import { LobbyConfig } from "../../types.js";
import { broadcastLobbiesUpdate } from "./broadcastLobbiesUpdate.js";

export function onCreateLobby(this: Socket, data: LobbyConfig) {
  const lobby = new Lobby(data);
  lobby.addPlayer({ playerName: data.playerName, playerId: this.id });
  lobby.ownerId = this.id;
  lobby.ownerName = data.playerName;

  lobbyManager.addLobby(lobby);
  console.log("Lobby created");

  this.join(lobby.id);
  this.emit(SocketEvents.LOBBY_CREATED, lobby.id);

  broadcastLobbiesUpdate();
}
