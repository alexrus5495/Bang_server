import { Socket } from "socket.io";
import { lobbyManager } from "../../lib/LobbyManager.js";
import { promiseKeys } from "../../game/engine/runtime/runtimeKeys.js";
import { Game } from "../../game/engine/core/game.js";

export type ResolveInteractionPayload = {
  type: "GENERAL_STORE";
  cardIndex: number;
  playerId: string;
};

export function onResolveInteraction(
  this: Socket,
  payload: ResolveInteractionPayload,
) {
  const lobby = lobbyManager.getLobbyByPlayerId(this.id);
  if (!lobby?.game) return;

  const player = lobby.game.stateCtrl.playerCtrl.getPlayerById(this.id);
  if (!player) return;

  switch (payload.type) {
    case "GENERAL_STORE":
      resolveGeneralStoreInteraction(
        payload.cardIndex,
        payload.playerId,
        lobby.game,
      );
    default:
      break;
  }
}

function resolveGeneralStoreInteraction(
  cardIndex: number,
  playerId: string,
  game: Game,
) {
  const player = game.stateCtrl.playerCtrl.getPlayerById(playerId);
  if (!player) return;
  game.actions.interaction.pickStoreCard(playerId, cardIndex);
}
