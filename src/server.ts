import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import { getCurrentTime } from "./lib/getCurrentTime.js";
import { onSubscribeLobbies } from "./middleware/onSubscribeLobbies.js";
import { onUnsubscribeLobbies } from "./middleware/onUnsubscribeLobbies.js";
import { onCreateLobby } from "./middleware/onCreateLobby.js";
import { onDisconnect } from "./middleware/onDisconnect.js";

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log(`[${getCurrentTime()}] NEW CONNECTION: ${socket.id}`);

  socket.on("SUBSCRIBE_LOBBIES", onSubscribeLobbies);

  socket.on("UNSUBSCRIBE_LOBBIES", onUnsubscribeLobbies);

  socket.on("CREATE_LOBBY", onCreateLobby);

  socket.on("disconnect", onDisconnect);
});

httpServer.listen(3000, () => {
  console.log("Server is now running on ws://localhost:3000");
});
