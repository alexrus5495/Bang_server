import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";
import { equipCardEffect } from "../helpers.js";

export const BARREL: EffectHandler = ({ game, player, cardId }) => {
  if (!cardId.startsWith("barrel_")) throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [BARREL]`);

  equipCardEffect(game, player, cardId, "barrel_");
};
