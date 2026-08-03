import { Socket } from "socket.io";
import { io } from "./server.js";
import { Lobby } from "./lobby.js";
import { LobbyConfig } from "./types.js";
import { lobbyManager } from "./lib/LobbyManager.js";
import { initializeGame } from "./game/engine/gameInitializer.js";
import { SocketEvents } from "./socket-events.js";

const testLobby = {
  lobbyName: "TEST_LOBBY",
  playerName: "BOBBY",
  isPrivate: false,
  password: "",
  numberOfSeats: 7,
  seats: [
    {
      id: 0,
      type: "human",
      color: "#F6272B",
      status: "occupied",
      playerId: "",
      playerName: "Abcdefghigklmno",
      isReady: true,
    },
    {
      id: 1,
      type: "ai",
      color: "#FF8D28",
      status: "open",
      playerId: "001",
      playerName: "botName0",
      isReady: true,
    },
    {
      id: 2,
      type: "ai",
      color: "#FFCC00",
      status: "open",
      playerId: "002",
      playerName: "botName1",
      isReady: true,
    },
    {
      id: 3,
      type: "ai",
      color: "#34C759",
      status: "open",
      playerId: "003",
      playerName: "botName2",
      isReady: true,
    },
    {
      id: 4,
      type: "ai",
      color: "#34C759",
      status: "open",
      playerId: "004",
      playerName: "botName3",
      isReady: true,
    },
    {
      id: 5,
      type: "ai",
      color: "#34C759",
      status: "open",
      playerId: "005",
      playerName: "botName4",
      isReady: true,
    },
    {
      id: 6,
      type: "ai",
      color: "#34C759",
      status: "open",
      playerId: "006",
      playerName: "botName5",
      isReady: true,
    },
  ],
} satisfies LobbyConfig;

export async function onTestGame(this: Socket) {
  const data = structuredClone(testLobby);
  data.seats[0].playerId = this.id;
  const lobby = new Lobby(data);
  lobby.ownerId = this.id;
  lobby.ownerName = data.playerName;

  lobbyManager.addLobby(lobby);

  this.join(lobby.id);

  const validation = lobbyManager.doPregameValidation(lobby);

  if (!validation.result) return;

  lobby.status = "starting";

  lobby.game = await initializeGame(
    lobby.numberOfSeats,
    lobby.id,
    lobby.eventSystem,
  );

  io.to(lobby.id).emit(SocketEvents.GAME_CREATED);

  lobby.game.flow.prepareGame();

  for (const player of lobby.seats) {
    if (player.type === "ai") {
      lobby.game.stateCtrl.assignmentService.assignToAnEmptySlot(player);
    }
  }
}
