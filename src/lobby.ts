import { LobbyConfig, LobbySeat } from "./types.js";

export class Lobby {
  id: string;
  name: string;
  status: "waiting" | "starting" | "in_game";
  ownerId: string;
  ownerName: string;
  numberOfSeats: number;
  seats: LobbySeat[];
  isPrivate: boolean;
  password: string | null;

  constructor(socketId: string, lobbyConfig: LobbyConfig) {
    this.id = socketId;
    this.name = lobbyConfig.lobbyName;
    this.status = "waiting";
    this.ownerId = socketId;
    this.ownerName = lobbyConfig.playerName;
    this.numberOfSeats = lobbyConfig.numberOfSeats;
    this.seats = lobbyConfig.seats;
    this.isPrivate = lobbyConfig.isPrivate;
    this.password = lobbyConfig.isPrivate ? lobbyConfig.password : null;
    this.seats[0].playerId = socketId;
    this.seats[0].playerName = lobbyConfig.playerName;
  }
}
