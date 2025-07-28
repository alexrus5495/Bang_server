import { Socket } from "socket.io";
import { getCurrentTime } from "../lib/getCurrentTime.js";
import { lobbySubscribers } from "../lib/lobbies.js";

export function onUnsubscribeLobbies(this: Socket) {
  lobbySubscribers.delete(this.id);
  console.log(`[${getCurrentTime()}] ${this.id} unsubscribed from lobbies`);
}
