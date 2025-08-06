import { Socket } from "socket.io";
import { SocketEvents } from "../socket-events.js";
import { onAskForLobby } from "./lobby/onAskForLobby.js";
import { onToggleReady } from "./lobby/onToggleReady.js";
import { onToggleSeatType } from "./lobby/onToggleSeatType.js";
import { onKickOutPlayer } from "./lobby/onKickOutPlayer.js";
import { onSubscribeLobbies } from "./lobby/onSubscribeLobbies.js";
import { onUnsubscribeLobbies } from "./lobby/onUnsubscribeLobbies.js";
import { onCreateLobby } from "./lobby/onCreateLobby.js";
import { onJoinLobby } from "./lobby/onJoinLobby.js";
import { onRequestLobbydata } from "./lobby/onRequestLobbyData.js";
import { onExitLobby } from "./lobby/onExitLobby.js";

export function registerLobbyHandlers(socket: Socket) {
  socket.on(SocketEvents.ASK_FOR_LOBBY, onAskForLobby);
  socket.on(SocketEvents.TOGGLE_READY, onToggleReady);
  socket.on(SocketEvents.TOGGLE_SEAT_TYPE, onToggleSeatType);
  socket.on(SocketEvents.KICK_OUT_PLAYER, onKickOutPlayer);
  socket.on(SocketEvents.SUBSCRIBE_LOBBIES, onSubscribeLobbies);
  socket.on(SocketEvents.UNSUBSCRIBE_LOBBIES, onUnsubscribeLobbies);
  socket.on(SocketEvents.CREATE_LOBBY, onCreateLobby);
  socket.on(SocketEvents.JOIN_LOBBY, onJoinLobby);
  socket.on(SocketEvents.REQUEST_LOBBY_DATA, onRequestLobbydata);
  socket.on(SocketEvents.EXIT_LOBBY, onExitLobby);
}
