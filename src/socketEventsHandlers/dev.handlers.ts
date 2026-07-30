import { Socket } from "socket.io";
import { SocketEvents } from "../socket-events.js";
import { onDevAddToHand } from "./dev/onAddToHand.js";

export function registerDevHandlers(socket: Socket) {
  socket.on(SocketEvents.ADD_TO_HAND, onDevAddToHand);
}
