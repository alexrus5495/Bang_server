import { Socket } from "socket.io";
import { SocketEvents } from "../socket-events.js";
import { onDisconnect } from "./connection/onDisconnect.js";

export function registerConnectionHandlers(socket: Socket) {
  socket.on(SocketEvents.disconnect, onDisconnect);
}
