import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";

export const SALOON: EffectHandler = ({ game, cardId: _, player }) => {
  console.log(`${player.nickname} plays [SALOON]`);

  const activePlayers = game.StateController.player.getActivePlayers();

  let targets: Array<{
    playerId: string;
    amount: number;
    newHealth: number;
  }> = [];

  for (const player of activePlayers) {
    const healingAmount = game.validator.getHealingAmount(player) as number;
    if (!healingAmount) throw new Error("Failed to get healing amount");

    if (player.stats.health.current < player.stats.health.max) {
      game.StateController.player.heal(player, healingAmount);

      targets.push({
        playerId: player.id,
        amount: healingAmount,
        newHealth: player.stats.health.current,
      });
    }
  }

  game.EventSystem.player.massHeal(targets);
  game.EventSystem.card.tableCleared();
};
