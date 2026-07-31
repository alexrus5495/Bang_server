import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";

export const BEER: EffectHandler = ({ game, cardId, player }) => {
  console.log(`${player.nickname} plays [BEER]`);

  const healingAmount = game.validator.getHealingAmount(player);

  if (!healingAmount) throw new Error("Failed to get healing amount");

  if (game.validator.playersActive <= 2) {
    console.log("[BEER] has no effect!");
  } else {
    game.StateController.player.heal(player, healingAmount);
  }
};
