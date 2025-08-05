import { Socket } from "socket.io";
import { getCurrentTime } from "../lib/getCurrentTime.js";
import { broadcastLobbiesUpdate } from "../lib/lobbies.js";

export function onSubscribeLobbies(this: Socket) {
  this.join("LOBBY_SUBSCRIBERS");

  console.log(`[${getCurrentTime()}] ${this.id} subscribed to lobbies`);
  broadcastLobbiesUpdate();
}
