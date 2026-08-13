import { randomDelay } from "../../../../../lib/randomDelay.js";
import { AiHandlerContext } from "../loader.js";

export default function handler({
  game,
  brain,
  data,
}: AiHandlerContext<"CHAR_CARDS_DEALT">) {
  if (!brain) return;

  const delay = randomDelay(3000, 500);

  setTimeout(() => {
    const selectedIndex = brain.selectBestCharOption(data.options);

    game.actions.interaction.pickChar(brain.playerId, selectedIndex);
  }, delay);
}
