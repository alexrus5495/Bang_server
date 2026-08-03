import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";

export const WELLS_FARGO: EffectHandler = ({ game, cardId, player }) => {
  if (!cardId.startsWith("wells_fargo_"))
    throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [WELLS_FARGO]`);

  game.actions.card.drawToHand(player, 3);
  game.eventSystem.card.tableCleared();
};
