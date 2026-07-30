import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";
import { equipWeaponEffect } from "../helpers.js";

export const WINCHESTER: EffectHandler = ({ game, cardId, player }) => {
  if (!cardId.startsWith("winchester_"))
    throw new Error("Got unexpected cardId");
  console.log(`${player.nickname} plays [WINCHESTER]`);

  equipWeaponEffect(game, player, cardId, "winchester_");
};
