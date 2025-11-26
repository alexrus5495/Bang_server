import { io } from "../server.js";
import { SocketEvents } from "../socket-events.js";

export function sendTimerUpdate(receiverID: string, data: number) {
  io.to(receiverID).emit(SocketEvents.SEND_TIMER_UPDATE, data);
}
