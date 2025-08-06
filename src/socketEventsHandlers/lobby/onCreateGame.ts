import { Socket } from "socket.io";
import { initializeGame } from "../../game/engine/gameInitializer.js";
import { io } from "../../server.js";
import { SocketEvents } from "../../socket-events.js";
import { lobbyManager } from "../../lib/LobbyManager.js";

export async function onCreateGame(this: Socket, lobbyId: string) {
  console.log("GOT CREATE GAME");

  const lobby = lobbyManager.getLobbyById(lobbyId);
  if (!lobby) return;

  console.log("FOUND LOBBY");

  const validation = lobbyManager.doPregameValidation(lobby);

  if (!validation.result) return;

  console.log("PASSED VALIDATION");

  lobby.status = "starting";

  console.log("CREATING GAME");

  lobby.game = await initializeGame(lobby.numberOfSeats);

  console.log("GAME CREATED");

  // console.log("PREPARING MATCH");
  //
  // lobby.game.flow.matchPreparer.prepare();
  //
  // console.log("ASSIGNING PLAYERS");
  //
  // for (const seat of lobby.seats) {
  //   const isAI = seat.type === "ai";
  //
  //   lobby.game.SC.player.assignToAnEmptySlot(seat.playerName as string, isAI);
  // }
  //
  // console.log("PLAYERS ASSIGNED");
  //
  // lobby.status = "in_game";

  io.to(lobbyId).emit(SocketEvents.GAME_CREATED);

  console.log("SENT GAME CREATED");
}
