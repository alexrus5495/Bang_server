import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";

export const SALOON: EffectHandler = ({ game, cardId, player }) => {
  console.log(`${player.nickname} plays [SALOON]`);

  const activePlayers = game.StateController.player.getActivePlayers();

  for (const player of activePlayers) {
    const healingAmount = game.validator.getHealingAmount(player) as number;
    game.StateController.player.heal(player, healingAmount);
    console.log(`${player.nickname} restores ${healingAmount} HP`);
  }
};
