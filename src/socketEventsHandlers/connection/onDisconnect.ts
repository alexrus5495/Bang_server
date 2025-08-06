import { Socket } from "socket.io";
import { lobbyManager } from "../../lib/LobbyManager.js";
import { broadcastLobbiesUpdate } from "../lobby/broadcastLobbiesUpdate.js";
import { getCurrentTime } from "../../lib/getCurrentTime.js";

export function onDisconnect(this: Socket) {
  lobbyManager.clearPlayer(this.id);
  this.leave("LOBBY_SUBSCRIBERS");
  broadcastLobbiesUpdate();
  console.log(`[${getCurrentTime()}] DISCONNECTED: ${this.id}`);
}
