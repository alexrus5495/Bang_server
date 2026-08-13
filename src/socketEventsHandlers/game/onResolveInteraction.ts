import { Socket } from "socket.io";
import { lobbyManager } from "../../lib/LobbyManager.js";
import { Game } from "../../game/engine/core/game.js";

export type ResolveInteractionPayload =
  | {
      type: "GENERAL_STORE";
      cardIndex: number;
      playerId: string;
    }
  | {
      type: "CHAR_SELECTION";
      playerId: string;
      optionIndex: number;
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
      break;
    case "CHAR_SELECTION":
      resolveCharSelectionInteraction(
        payload.playerId,
        payload.optionIndex,
        lobby.game,
      );
      break;
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

function resolveCharSelectionInteraction(
  playerId: string,
  optionIndex: number,
  game: Game,
) {
  console.log(`got resolve interaction for char selection`);
  const player = game.stateCtrl.playerCtrl.getPlayerById(playerId);
  if (!player) return;
  game.actions.interaction.pickChar(playerId, optionIndex);
}
