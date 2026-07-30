import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";
import { equipWeaponEffect } from "../helpers.js";

export const SCHOFIELD: EffectHandler = ({ game, cardId, player }) => {
  if (!cardId.startsWith("schofield_"))
    throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [SCHOFIELD]`);

  equipWeaponEffect(game, player, cardId, "schofield_");
};
