import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";

export const JAIL: EffectHandler = ({ game, player, targetPlayer, cardId }) => {
  if (!targetPlayer)
    throw new Error(`[BANG] Target player is required for card ${cardId}`);
  if (!cardId.startsWith("jail_")) throw new Error("Got unexpected cardId");

  console.log(
    `${player.nickname} plays [JAIL] againg ${targetPlayer.nickname}`,
  );

  game.StateController.player.addCardToEquipment(targetPlayer, cardId);
};
