import { Socket } from "socket.io";
import { Lobby } from "../../lobby.js";
import { broadcastLobbiesUpdate, lobbies } from "../../lib/lobbies.js";
import { SocketEvents } from "../../socket-events.js";
import { LobbyConfig } from "../../types.js";

export function onCreateLobby(this: Socket, data: LobbyConfig) {
  const lobby = new Lobby(data);
  lobby.addPlayer({ playerName: data.playerName, playerId: this.id });
  lobby.ownerId = this.id;
  lobby.ownerName = data.playerName;

  lobbies[lobby.id] = lobby;
  console.log("Lobby created");

  this.join(lobby.id);
  this.emit(SocketEvents.LOBBY_CREATED, lobby.id);

  broadcastLobbiesUpdate();

  console.log(lobbies);
}
