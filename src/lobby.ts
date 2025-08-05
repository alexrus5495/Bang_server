import { botNames } from "./config/botNames.js";
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
  private availableBotNames: string[];
  private usedBotNames: string[];

  constructor(lobbyConfig: LobbyConfig) {
    this.id = this.generateLobbyId();
    this.name = lobbyConfig.lobbyName;
    this.status = "waiting";
    this.ownerId = "";
    this.ownerName = "";
    this.numberOfSeats = lobbyConfig.numberOfSeats;
    this.seats = lobbyConfig.seats;
    this.isPrivate = lobbyConfig.isPrivate;
    this.password = lobbyConfig.isPrivate ? lobbyConfig.password : null;
    this.usedBotNames = [];
    this.availableBotNames = [...botNames];

    this.fillBotNames();
  }

  get totalHumanSlots() {
    let result = 0;
    for (let seat of this.seats) {
      if (seat.type === "human") result++;
    }
    return result;
  }

  get occupiedHumanSlots() {
    let result = 0;
    for (let seat of this.seats) {
      if (seat.type === "human" && seat.status !== "open") result++;
    }
    return result;
  }

  get availableHumanSlots() {
    return `${this.occupiedHumanSlots}/${this.totalHumanSlots}`;
  }

  get publicData() {
    return {
      id: this.id,
      name: this.name,
      ownerName: this.ownerName,
      ownerId: this.ownerId,
      availableHumanSlots: this.availableHumanSlots,
      numberOfSeats: this.numberOfSeats,
      seats: this.seats,
      isPrivate: this.isPrivate,
    };
  }

  get playersIDs() {
    const playersIDs = [];

    for (let seat of this.seats) {
      if (seat.type === "human" && seat.status !== "open")
        playersIDs.push(seat.playerId);
    }

    return playersIDs;
  }

  generateLobbyId() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomValues = new Uint32Array(20);
    crypto.getRandomValues(randomValues);

    let result = "";
    for (let i = 0; i < 20; i++) {
      result += chars[randomValues[i] % chars.length];
    }

    return result;
  }
  addPlayer(playerData: { playerName: string; playerId: string }) {
    const seat = this.findFreeSlot();

    if (seat) {
      seat.playerId = playerData.playerId;
      seat.playerName = playerData.playerName;
      seat.status = "occupied";
      seat.isReady = false;
    }
  }

  freeSeat(seat: LobbySeat) {
    const isLobbyOwner = seat.playerId === this.ownerId;

    seat.playerId = undefined;
    seat.playerName = undefined;
    seat.status = "open";
    seat.isReady = false;

    if (isLobbyOwner) this.passOwnership();
  }

  passOwnership() {
    let newOwner;
    for (const seat of this.seats) {
      if (seat.type === "human" && seat.status !== "open") {
        newOwner = seat;
      }
    }

    if (newOwner) {
      this.ownerId = newOwner.playerId as string;
      this.ownerName = newOwner.playerName as string;
    }
  }

  removePlayer(playerId: string) {
    const playerSeat = this.seats.find((seat) => seat.playerId === playerId);

    if (!playerSeat) {
      console.log("Failed to find player's seat");
      return;
    }

    this.freeSeat(playerSeat);
    console.log("Player removed");
  }

  private findFreeSlot() {
    for (let seat of this.seats) {
      if (seat.type === "human" && seat.status === "open") return seat;
    }

    return undefined;
  }

  arePlayersReady() {
    for (let seat of this.seats) {
      if (seat.type === "human" && seat.status === "open") return false;
      if (seat.type === "human" && seat.isReady === false) return false;
    }
    return true;
  }

  private getFreeBotName() {
    const randomIndex = Math.floor(
      Math.random() * this.availableBotNames.length,
    );
    return this.availableBotNames.splice(randomIndex, 1)[0];
  }

  private fillBotNames() {
    for (const seat of this.seats) {
      if (seat.type === "ai") {
        const name = this.getFreeBotName();
        this.addBotName(seat, name);
      }
    }
  }

  private addBotName(seat: LobbySeat, name: string) {
    seat.playerName = name;
    this.usedBotNames.push(name);
  }

  private removeBotName(seat: LobbySeat) {
    if (!seat.playerName) return;
    this.availableBotNames.push(seat.playerName);
    seat.playerName = undefined;
  }

  switchSeatType(seat: LobbySeat) {
    if (seat.type === "human") {
      seat.type = "ai";
      seat.status = "occupied";
      this.addBotName(seat, this.getFreeBotName());
    } else {
      seat.type = "human";
      seat.status = "open";
      this.removeBotName(seat);
    }
  }
}
