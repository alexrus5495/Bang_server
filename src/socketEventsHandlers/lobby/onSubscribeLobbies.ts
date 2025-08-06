import { Socket } from "socket.io";
import { broadcastLobbiesUpdate } from "./broadcastLobbiesUpdate.js";

export function onSubscribeLobbies(this: Socket) {
  this.join("LOBBY_SUBSCRIBERS");

  broadcastLobbiesUpdate();
}
