import { Socket } from "socket.io";
import { lobbyManager } from "../../lib/LobbyManager.js";

export function onDevDamagePlayer(this: Socket, payload: { playerId: string }) {
  console.log(`got dev damage player for playerId: ${payload.playerId}`);
  const game = lobbyManager.getLobbyByPlayerId(this.id)?.game;
  if (!game) return;

  const player = game.StateController.player.getPlayerById(payload.playerId);
  if (!player) return;

  console.log(`old health = ${player.stats.health.current}`);
  player.takeDamage(1);
  console.log(`new health = ${player.stats.health.current}`);
}
