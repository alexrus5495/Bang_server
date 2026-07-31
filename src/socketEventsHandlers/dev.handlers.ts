import { Socket } from "socket.io";
import { SocketEvents } from "../socket-events.js";
import { onDevAddToHand } from "./dev/onDevAddToHand.js";
import { onDevHealPlayer } from "./dev/onDevHealPlayer.js";
import { onDevDamagePlayer } from "./dev/onDevDamagePlayer.js";

export function registerDevHandlers(socket: Socket) {
  socket.on(SocketEvents.DEV_ADD_TO_HAND, onDevAddToHand);
  socket.on(SocketEvents.DEV_HEAL_PLAYER, onDevHealPlayer);
  socket.on(SocketEvents.DEV_DAMAGE_PLAYER, onDevDamagePlayer);
}
