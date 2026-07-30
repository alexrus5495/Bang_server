import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";
import { equipWeaponEffect } from "../helpers.js";

export const REMINGTON: EffectHandler = ({ game, cardId, player }) => {
  if (!cardId.startsWith("remington_"))
    throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [REMINGTON]`);
  equipWeaponEffect(game, player, cardId, "remington_");
};
