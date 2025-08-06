import { Socket } from "socket.io";
import { SocketEvents } from "../socket-events.js";
import { onCreateGame } from "./lobby/onCreateGame.js";

export function registerGameHandlers(socket: Socket) {
  socket.on(SocketEvents.CREATE_GAME, onCreateGame);
}
