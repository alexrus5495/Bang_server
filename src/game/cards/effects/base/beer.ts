import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";

export const BEER: EffectHandler = ({ game, cardId, player }) => {
  console.log(`${player.nickname} plays [BEER]`);

  const healingAmount = game.validator.getHealingAmount(player);

  if (!healingAmount) throw new Error("Failed to get healing amount");

  if (game.validator.playersActive <= 2) {
    game.eventSystem.card.effectFailed({
      playerId: player.id,
      cardId,
      reason: "TWO_PEOPLE_LEFT",
    });
    return;
  }

  if (player.stats.health.current === player.stats.health.max) {
    game.eventSystem.card.effectFailed({
      playerId: player.id,
      cardId,
      reason: "HEALTH_FULL",
    });
    return;
  }

  game.stateCtrl.playerCtrl.heal(player, healingAmount);

  game.eventSystem.player.healed({
    playerId: player.id,
    amount: healingAmount,
    newHealth: player.stats.health.current,
  });

  game.eventSystem.card.tableCleared();
};
