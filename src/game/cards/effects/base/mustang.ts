import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";
import { equipCardEffect } from "../helpers.js";

export const MUSTANG: EffectHandler = ({ game, cardId, player }) => {
  if (!cardId.startsWith("mustang_")) throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [MUSTANG]`);

  equipCardEffect(game, player, cardId, "mustang_");
};
