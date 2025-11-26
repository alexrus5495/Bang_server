import { Socket } from "socket.io";
import { lobbyManager } from "../../lib/LobbyManager.js";
import { broadcastPublicData } from "../../lib/broadcastPublicData.js";
import { timerKeys } from "../../game/engine/runtime/runtimeKeys.js";

export function onSelectChar(this: Socket, lobbyId: string, charOption: 0 | 1) {
  console.log("GOT SELECT CHAR");
  console.log(`lobbyID: ${lobbyId}, charOption: ${charOption}`);

  const lobby = lobbyManager.lobbies[lobbyId];
  if (!lobby) return;

  const game = lobby.game;
  if (!game) return;

  const player = game.StateController.player.getPlayerById(this.id);
  if (!player) return;

  //Cleanup auto-resolve timer
  const playerIndex = game.StateController.player.getPlayersIndex(player);
  game.runtime.cleanupBroadcastedRuntimeTimer(
    timerKeys.charSelection.replace("{index}", `${playerIndex}`),
  );

  //Assign character
  game.StateController.assignmentService.assignChar(player, charOption);
  broadcastPublicData(game.id);
}
