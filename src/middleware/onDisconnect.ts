import { Socket } from "socket.io";
import { broadcastLobbiesUpdate, clearPlayer } from "../lib/lobbies.js";
import { getCurrentTime } from "../lib/getCurrentTime.js";

export function onDisconnect(this: Socket) {
  clearPlayer(this.id);
  this.leave("LOBBY_SUBSCRIBERS");
  broadcastLobbiesUpdate();
  console.log(`[${getCurrentTime()}] DISCONNECTED: ${this.id}`);
}
