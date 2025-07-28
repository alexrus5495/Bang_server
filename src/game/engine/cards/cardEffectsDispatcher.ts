import type { PlayingCardMeta } from "../../../types.js";
import type { Game } from "../core/game.js";
import type { Player } from "../player/player.js";
import { GameStateController } from "../state/gameStateController.js";
import { GameStateValidator } from "../state/gameStateValidator.js";
import {
  CARD_EFFECTS_REGISTRY,
  type EffectWithoutTarget,
  type EffectWithTarget,
} from "./cardEffectsRegistry.js";

export class CardEffectsDispatcher {
  private SC: GameStateController;
  private validator: GameStateValidator;
  private game: Game;

  constructor(
    stateController: GameStateController,
    validator: GameStateValidator,
    game: Game,
  ) {
    this.SC = stateController;
    this.validator = validator;
    this.game = game;
  }

  tryToPlayCard(
    cardIndex: number,
    playerIndex: number,
    targetPlayerIndex?: number,
  ) {
    const player = this.SC.player.getPlayer(playerIndex);
    const targetPlayer = targetPlayerIndex
      ? this.SC.player.getPlayer(targetPlayerIndex)
      : undefined;

    if (targetPlayer && targetPlayer.flags.isEliminated) {
      console.log(`Can't play a card against eliminated player.`);
      return;
    }

    if (this.validator.isCardAllowedToPlay(cardIndex, player, targetPlayer)) {
      this.playCard(cardIndex, player, targetPlayer);
    } else {
      console.log(`Card is not allowed to play!`);
    }
  }

  private playCard(cardIndex: number, player: Player, targetPlayer?: Player) {
    let cardId = player.hand[cardIndex];

    //1. Trigger card effect
    if (player.char === "calamity_janet") {
      cardId = this.validator.tryCalamityJanetCardSwap(cardId, player);
    }

    this.triggerCardEffect(cardId, player, targetPlayer);

    //2. Non equipment cards are discarded after their effect is triggered.
    //Equipment cards need to go to the particular player equipment array, so
    //they are not discarded. Where exactly the equipment card goes after being
    //played is decided by their effect function.
    const cardMeta = this.SC.cards.getCardMeta(
      cardId,
      "deck",
    ) as PlayingCardMeta;
    const isEquipment = cardMeta.effect.isEquipment;

    if (!isEquipment) {
      this.SC.cards.discardFromHand(cardIndex, player);
    }
  }

  private triggerCardEffect(
    cardId: string,
    player: Player,
    targetPlayer?: Player,
  ) {
    const cardEffectFunctionName = cardId.split("_")[0].toUpperCase();

    const effect = CARD_EFFECTS_REGISTRY[cardEffectFunctionName];

    if (!effect) {
      throw new Error(
        `Failed to find corresponding effect function for ${cardId}`,
      );
    }

    switch (effect.length) {
      case 4: {
        if (!targetPlayer) {
          throw new Error(`Effect ${cardId} requires a targetPlayer`);
        }
        (effect as EffectWithTarget)(this.game, player, targetPlayer, cardId);
        break;
      }
      case 3: {
        if (targetPlayer) {
          console.warn(`Effect ${cardId} doesn't need targetPlayer`);
        }
        (effect as EffectWithoutTarget)(this.game, player, cardId);
        break;
      }
      default: {
        throw new Error(`Got unexpected effect function for ${cardId}`);
      }
    }
  }
}
