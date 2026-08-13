import { Socket } from "socket.io";
import { SocketEvents } from "../socket-events.js";
import { onCreateGame } from "./lobby/onCreateGame.js";
import { onJoinGame } from "./game/onJoinGame.js";
import { onRequestHandValidation } from "./game/onRequestHandValidation.js";
import { onPlayCard } from "./game/onPlayCard.js";
import { onResolveInteraction } from "./game/onResolveInteraction.js";

export function registerGameHandlers(socket: Socket) {
  socket.on(SocketEvents.CREATE_GAME, onCreateGame);
  socket.on(SocketEvents.JOIN_GAME, onJoinGame);
  socket.on(SocketEvents.REQUEST_HAND_VALIDATION, onRequestHandValidation);
  socket.on(SocketEvents.PLAY_CARD, onPlayCard);
  socket.on(SocketEvents.RESOLVE_INTERACTION, onResolveInteraction);
}
