import { Socket } from "socket.io";
import { getCurrentTime } from "../lib/getCurrentTime.js";

export function onUnsubscribeLobbies(this: Socket) {
  this.leave("LOBBY_SUBSCRIBERS");
  console.log(`[${getCurrentTime()}] ${this.id} unsubscribed from lobbies`);
}
