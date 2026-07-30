import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import { registerConnectionHandlers } from "./socketEventsHandlers/connection.handlers.js";
import { registerLobbyHandlers } from "./socketEventsHandlers/lobby.handlers.js";
import { registerGameHandlers } from "./socketEventsHandlers/game.handlers.js";
import { SocketEvents } from "./socket-events.js";

import "./TEST_GAME.js";
import { onTestGame } from "./TEST_GAME.js";
import { registerDevHandlers } from "./socketEventsHandlers/dev.handlers.js";

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, { cors: { origin: "*" } });

io.on(SocketEvents.connection, (socket) => {
  socket.once("TEST_GAME", onTestGame);

  registerConnectionHandlers(socket);

  registerLobbyHandlers(socket);

  registerGameHandlers(socket);

  registerDevHandlers(socket);
});

httpServer.listen(3000, () => {
  console.log("Server is now running on ws://localhost:3000");
});
