import { Socket } from "socket.io";

export function onUnsubscribeLobbies(this: Socket) {
  this.leave("LOBBY_SUBSCRIBERS");
}
