import { randomDelay } from "../../../../../lib/randomDelay.js";
import { AiHandlerContext } from "../loader.js";

export default function handler({
  game,
  brain,
  data,
}: AiHandlerContext<"PLAYER_DISCARDING_START">) {
  console.log(`inside discarding start`);
  if (!brain) return;

  const player = game.stateCtrl.playerCtrl.getPlayerById(data.playerId);
  if (!player || !player.isAI) return;

  const discardStep = () => {
    if (game.validator.canEndDiscardingPhase(player)) {
      game.turnMngr.endDiscardingPhase(player);
      return;
    }

    const delay = randomDelay(1500, 500);

    setTimeout(() => {
      if (player.hand.length > 0) {
        game.actions.card.discardFromHand(0, player);
      }

      discardStep();
    }, 1);
  };

  discardStep();
}
