import { Socket } from "socket.io";
import { getCurrentTime } from "../lib/getCurrentTime.js";
import { broadcastLobbiesUpdate, lobbySubscribers } from "../lib/lobbies.js";

export function onSubscribeLobbies(this: Socket) {
  lobbySubscribers.add(this.id);
  console.log(`[${getCurrentTime()}] ${this.id} subscribed to lobbies`);
  broadcastLobbiesUpdate();
}
