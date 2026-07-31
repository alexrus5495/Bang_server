import { Socket } from "socket.io";
import { lobbyManager } from "../../lib/LobbyManager.js";

export function onDevHealPlayer(this: Socket, payload: { playerId: string }) {
  console.log(`got dev heal player for id ${payload.playerId}`);
  const game = lobbyManager.getLobbyByPlayerId(this.id)?.game;
  if (!game) return;
  console.log(`got game`);

  const player = game.StateController.player.getPlayerById(payload.playerId);
  if (!player) return;
  console.log(`got player`);

  console.log(`old health = ${player.stats.health.current}`);
  player.heal(1);
  console.log(`new health = ${player.stats.health.current}`);
}
