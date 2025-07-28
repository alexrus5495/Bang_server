import { Socket } from "socket.io";
import {
  broadcastLobbiesUpdate,
  lobbies,
  lobbySubscribers,
} from "../lib/lobbies.js";
import { getCurrentTime } from "../lib/getCurrentTime.js";

export function onDisconnect(this: Socket) {
  if (lobbies[this.id]) {
    delete lobbies[this.id];
    console.log(`[${getCurrentTime()}] Lobby deleted: ${this.id}`);
    broadcastLobbiesUpdate();
  }

  lobbySubscribers.delete(this.id);
  console.log(`[${getCurrentTime()}] DISCONNECTED: ${this.id}`);
}
