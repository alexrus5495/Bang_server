import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";
import { equipWeaponEffect } from "../helpers.js";

export const VOLCANIC: EffectHandler = ({ game, cardId, player }) => {
  if (!cardId.startsWith("volcanic_")) throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [VOLCANIC]`);

  equipWeaponEffect(game, player, cardId, "volcanic_");
};
