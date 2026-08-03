import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";

export const STAGECOACH: EffectHandler = ({ game, cardId, player }) => {
  if (!cardId.startsWith("stagecoach_"))
    throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [STAGECOACH]`);

  game.actions.card.drawToHand(player, 2);
  game.eventSystem.card.tableCleared();
};
