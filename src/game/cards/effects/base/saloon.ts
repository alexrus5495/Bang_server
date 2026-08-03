import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";

export const SALOON: EffectHandler = ({ game, cardId: _, player }) => {
  console.log(`${player.nickname} plays [SALOON]`);

  const activePlayers = game.stateCtrl.playerCtrl.getActivePlayers();

  let targets: Array<{
    playerId: string;
    amount: number;
    newHealth: number;
  }> = [];

  for (const player of activePlayers) {
    const healingAmount = game.validator.getHealingAmount(player) as number;
    if (!healingAmount) throw new Error("Failed to get healing amount");

    if (player.stats.health.current < player.stats.health.max) {
      game.stateCtrl.playerCtrl.heal(player, healingAmount);

      targets.push({
        playerId: player.id,
        amount: healingAmount,
        newHealth: player.stats.health.current,
      });
    }
  }

  game.eventSystem.player.massHeal(targets);
  game.eventSystem.card.tableCleared();
};
