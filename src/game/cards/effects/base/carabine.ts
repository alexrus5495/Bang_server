import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";
import { equipWeaponEffect } from "../helpers.js";

export const CARABINE: EffectHandler = ({ game, player, cardId }) => {
  if (!cardId.startsWith("carabine_")) throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [REV.CARABINE]`);
  equipWeaponEffect(game, player, cardId, "carabine_");
};
