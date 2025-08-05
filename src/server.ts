import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import { getCurrentTime } from "./lib/getCurrentTime.js";
import { onSubscribeLobbies } from "./middleware/onSubscribeLobbies.js";
import { onUnsubscribeLobbies } from "./middleware/onUnsubscribeLobbies.js";
import { onCreateLobby } from "./middleware/lobby/onCreateLobby.js";
import { onDisconnect } from "./middleware/onDisconnect.js";
import { onJoinLobby } from "./middleware/lobby/onJoinLobby.js";
import { onExitLobby } from "./middleware/lobby/onExitLobby.js";
import { onRequestLobbydata } from "./middleware/lobby/onRequestLobbyData.js";
import { onToggleReady } from "./middleware/lobby/onToggleReady.js";
import { onKickOutPlayer } from "./middleware/lobby/onKickOutPlayer.js";
import { SocketEvents } from "./socket-events.js";
import { onToggleSeatType } from "./middleware/lobby/onToggleSeatType.js";
import { onAskForLobby } from "./middleware/lobby/onAskForLobby.js";

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, { cors: { origin: "*" } });

io.on(SocketEvents.connection, (socket) => {
  console.log(`[${getCurrentTime()}] NEW CONNECTION: ${socket.id}`);

  socket.on(SocketEvents.ASK_FOR_LOBBY, onAskForLobby);

  socket.on(SocketEvents.SUBSCRIBE_LOBBIES, onSubscribeLobbies);

  socket.on(SocketEvents.UNSUBSCRIBE_LOBBIES, onUnsubscribeLobbies);

  socket.on(SocketEvents.CREATE_LOBBY, onCreateLobby);

  socket.on(SocketEvents.JOIN_LOBBY, onJoinLobby);

  socket.on(SocketEvents.REQUEST_LOBBY_DATA, onRequestLobbydata);

  socket.on(SocketEvents.EXIT_LOBBY, onExitLobby);

  socket.on(SocketEvents.TOGGLE_READY, onToggleReady);

  socket.on(SocketEvents.TOGGLE_SEAT_TYPE, onToggleSeatType);

  socket.on(SocketEvents.KICK_OUT_PLAYER, onKickOutPlayer);

  socket.on(SocketEvents.disconnect, onDisconnect);
});

httpServer.listen(3000, () => {
  console.log("Server is now running on ws://localhost:3000");
});
