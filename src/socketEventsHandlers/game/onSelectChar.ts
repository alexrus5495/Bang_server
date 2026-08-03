import { Socket } from "socket.io";
import { lobbyManager } from "../../lib/LobbyManager.js";

export function onSelectChar(this: Socket, lobbyId: string, charOption: 0 | 1) {
  const lobby = lobbyManager.lobbies[lobbyId];
  if (!lobby?.game) return;

  const player = lobby.game.StateController.player.getPlayerById(this.id);
  if (!player) return;

  lobby.game.IC.onPlayerPickChar(player, charOption);
}
