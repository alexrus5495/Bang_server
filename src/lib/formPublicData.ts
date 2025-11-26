import { Game } from "../game/engine/core/game.js";
import { getClientHand } from "./getClientHand.js";

export function formPublicData(clientId: string, game: Game) {
  const clientHand = getClientHand(clientId, game);

  const publicData = { ...game.publicData, clientHand: clientHand };

  return publicData;
}
