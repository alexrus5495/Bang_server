import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";
import { equipCardEffect } from "../helpers.js";

export const DYNAMITE: EffectHandler = ({ cardId, player, game }) => {
  if (!cardId.startsWith("dynamite_")) throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [DYNAMITE]`);

  equipCardEffect(game, player, cardId, "dynamite_");
};
