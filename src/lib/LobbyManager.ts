import { Lobby } from "../lobby.js";
import { LobbySeat } from "../types.js";

class LobbieManager {
  lobbies: Record<string, Lobby>;

  constructor() {
    this.lobbies = {} as Record<string, Lobby>;
  }

  addLobby(lobby: Lobby) {
    this.lobbies[lobby.id] = lobby;
  }

  getLobbyById(lobbyId: string) {
    return Object.values(this.lobbies).find((lobby) => lobby.id === lobbyId);
  }

  getLobbyByPlayerId(id: string) {
    return Object.values(this.lobbies).find((lobby) =>
      lobby.seats.some((seat) => seat.playerId === id),
    );
  }

  deleteLobby(lobby: Lobby) {
    delete this.lobbies[lobby.id];
  }

  clearPlayer(id: string) {
    const lobby = this.getLobbyByPlayerId(id);

    if (lobby) {
      const seat = lobby.seats.find(
        (seat) => seat.playerId === id,
      ) as LobbySeat;
      lobby.freeSeat(seat);
      if (lobby.occupiedHumanSlots === 0) this.deleteLobby(lobby);
    } else {
      console.log("Игрок не найден");
    }
  }
  doPregameValidation(lobby: Lobby) {
    for (const seat of lobby.seats) {
      if (seat.type === "human" && !seat.isReady) {
        console.log("Not all players ready");
        return { result: false, reason: "Not all players ready" };
      } else if (!seat.playerName) {
        console.log("Not every player have name assigned");
        return {
          result: false,
          reason: "Not every players have name assigned",
        };
      } else if (seat.type === "human" && seat.status === "open") {
        console.log("Some seats are still open");
        return { result: false, reason: "Some seats are still open" };
      }
    }

    return { result: true, reason: "All checks are passed" };
  }
}

export const lobbyManager = new LobbieManager();
