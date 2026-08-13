import { randomDelay } from "../../../../../lib/randomDelay.js";
import { AiHandlerContext } from "../loader.js";

export default function handlePlayerPlayingStart({
  game,
  brain,
  data,
}: AiHandlerContext<"PLAYER_PLAYING_START">) {
  if (!brain) return;

  const player = game.stateCtrl.playerCtrl.getPlayerById(data.playerId);
  if (!player || !player.isAI) return;

  setTimeout(() => {
    game.turnMngr.endPlayingPhase(player);
  }, randomDelay(500));
}
