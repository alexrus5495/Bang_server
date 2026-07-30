import { EventSystem } from "../../../eventSystem/eventSystem.js";
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
  private StateController: GameStateController;
  private validator: GameStateValidator;
  private EventSystem: EventSystem;
  private game: Game;

  constructor(
    stateController: GameStateController,
    validator: GameStateValidator,
    eventSystem: EventSystem,
    game: Game,
  ) {
    this.StateController = stateController;
    this.validator = validator;
    this.game = game;
    this.EventSystem = eventSystem;
  }

  playCard(cardIndex: number, player: Player, targetPlayer?: Player) {
    // 1. Remove card from the hand
    let cardId = this.StateController.player.removeCardFromHand(
      cardIndex,
      player,
    );

    this.EventSystem.card.played(player.id, cardId, cardIndex);

    //2. Trigger card effect
    if (player.char === "calamity_janet") {
      cardId = this.validator.tryCalamityJanetCardSwap(cardId, player);
    }

    this.triggerCardEffect(cardId, player, targetPlayer);

    //2. Non equipment cards are discarded after their effect is triggered.
    //Equipment cards need to go to the particular player equipment array, so
    //they are not discarded. Where exactly the equipment card goes after being
    //played is decided by their effect function.
    const cardMeta = this.StateController.cards.getCardMeta(
      cardId,
      "deck",
    ) as PlayingCardMeta;
    const isEquipment = cardMeta.effect.isEquipment;

    if (!isEquipment) {
      this.StateController.cards.discardCard(cardId);
    }
  }

  private triggerCardEffect(
    cardId: string,
    player: Player,
    targetPlayer?: Player,
  ) {
    const cardEffectFunctionName = cardId
      .split("_")
      .slice(0, -1)
      .join("_")
      .toUpperCase();

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
