import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";
import { equipCardEffect } from "../helpers.js";

export const SCOPE: EffectHandler = ({ game, cardId, player }) => {
  if (!cardId.startsWith("scope_")) throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [SCOPE]`);

  equipCardEffect(game, player, cardId, "scope_");
};
