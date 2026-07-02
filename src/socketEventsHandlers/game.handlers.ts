import { Socket } from "socket.io";
import { SocketEvents } from "../socket-events.js";
import { onCreateGame } from "./lobby/onCreateGame.js";
import { onJoinGame } from "./game/onJoinGame.js";
import { onRequestRole } from "./game/onRequestRole.js";
import { onRequestCharOptions } from "./game/onRequestCharOptions.js";
import { onSelectChar } from "./game/onSelectChar.js";
import { onRequestHandValidation } from "./game/onRequestHandValidation.js";

export function registerGameHandlers(socket: Socket) {
  socket.on(SocketEvents.CREATE_GAME, onCreateGame);
  socket.on(SocketEvents.JOIN_GAME, onJoinGame);
  socket.on(SocketEvents.REQUEST_ROLE, onRequestRole);
  socket.on(SocketEvents.REQUEST_CHAR_OPTIONS, onRequestCharOptions);
  socket.on(SocketEvents.SELECT_CHAR, onSelectChar);
  socket.on(SocketEvents.REQUEST_HAND_VALIDATION, onRequestHandValidation);
}
