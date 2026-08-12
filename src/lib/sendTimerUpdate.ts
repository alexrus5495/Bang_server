import { io } from "../server.js";
import { SocketEvents } from "../socket-events.js";

export type BroadcastedTimerData = {
  timerId: string;
  maxValue: number;
  currentValue: number;
};

export function sendTimerUpdate(
  receiverID: string,
  data: BroadcastedTimerData,
) {
  io.to(receiverID).emit(SocketEvents.SEND_TIMER_UPDATE, data);
}
