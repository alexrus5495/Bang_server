import { Lobby } from "../lobby.js";
import { io } from "../server.js";

export const lobbies: Record<string, Lobby> = {};
export const lobbySubscribers = new Set<string>();

export const broadcastLobbiesUpdate = () => {
  const publicLobbies = Object.values(lobbies).map((lobby) => {
    const { password, ...publicData } = lobby;
    return publicData;
  });

  lobbySubscribers.forEach((subscriperId) => {
    io.to(subscriperId).emit("LOBBIES_UPDATE", publicLobbies);
  });
};
