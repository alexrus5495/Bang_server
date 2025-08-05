import { Lobby } from "../lobby.js";
import { io } from "../server.js";
import { LobbySeat } from "../types.js";

export const lobbies: Record<string, Lobby> = {};

export const broadcastLobbiesUpdate = () => {
  const publicLobbies = Object.values(lobbies).map((lobby) => {
    if (lobby.status === "waiting") return lobby.publicData;
  });

  io.to("LOBBY_SUBSCRIBERS").emit("LOBBIES_UPDATE", publicLobbies);

  console.log("Lobbies broadcasted");
  console.log(publicLobbies);
};

export const getLobbyById = (id: string) => {
  return Object.values(lobbies).find((lobby) => lobby.id === id);
};

export const deleteLobby = (lobby: Lobby) => {
  delete lobbies[lobby.id];
};

export const clearPlayer = (id: string) => {
  const lobby = Object.values(lobbies).find((lobby) =>
    lobby.seats.some((seat) => seat.playerId === id),
  );

  if (lobby) {
    const seat = lobby.seats.find((seat) => seat.playerId === id) as LobbySeat;
    lobby.freeSeat(seat);
    if (lobby.occupiedHumanSlots === 0) deleteLobby(lobby);
  } else {
    console.log("Игрок не найден");
  }
};
