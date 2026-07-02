import { Socket } from "socket.io";
import { lobbyManager } from "../../lib/LobbyManager.js";
import { SocketEvents } from "../../socket-events.js";

export function onJoinGame(this: Socket, lobbyId: string) {
  // const lobby = lobbyManager.getLobbyById(lobbyId);
  //WARNING: for testing the lobby search is using player ID, delete this and uncomment previous line
  const lobby = lobbyManager.getLobbyByPlayerId(this.id);

  if (!lobby || !lobby.game) return;

  if (lobby.game.StateController.assignmentService.isPlayerAssigned(this.id)) {
    return;
  }

  const seat = lobby?.getSeatByPlayerId(this.id);

  if (!seat || !seat.playerName) return;

  lobby.game.StateController.assignmentService.assignToAnEmptySlot(seat);

  this.emit(SocketEvents.SEND_CARDS_META, lobby.game.publicCardMeta);
}
