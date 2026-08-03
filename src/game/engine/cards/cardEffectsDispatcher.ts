import { EventSystem } from "../../../eventSystem/eventSystem.js";
import type { PlayingCardMeta } from "../../../types.js";
import type { Game } from "../core/game.js";
import type { Player } from "../player/player.js";
import { GameStateController } from "../state/gameStateController.js";
import { GameStateValidator } from "../state/gameStateValidator.js";
import { CARD_EFFECTS_REGISTRY, EffectHandler } from "./cardEffectsRegistry.js";

export class CardEffectsDispatcher {
  private stateController: GameStateController;
  private validator: GameStateValidator;
  private eventSystem: EventSystem;
  private game: Game;

  constructor(
    stateController: GameStateController,
    validator: GameStateValidator,
    eventSystem: EventSystem,
    game: Game,
  ) {
    this.stateController = stateController;
    this.validator = validator;
    this.game = game;
    this.eventSystem = eventSystem;
  }

  playCard(cardIndex: number, player: Player, targetPlayer?: Player) {
    // 1. Remove card from the hand
    let cardId = this.stateController.playerCtrl.removeCardFromHand(
      cardIndex,
      player,
    );

    // 2. Register CARD_PLAYER event
    this.eventSystem.card.played(player.id, cardId, cardIndex);

    // 3. Trigger character specific card swap (e.g. Calamity Janet)
    if (player.char === "calamity_janet") {
      cardId = this.validator.tryCalamityJanetCardSwap(cardId, player);
    }

    // 4. Get card metadata
    const cardMeta = this.stateController.cardCtrl.getCardMeta(
      cardId,
      "deck",
    ) as PlayingCardMeta;

    // 5. Trigger card effect
    this.triggerCardEffect(cardId, cardMeta, player, targetPlayer);

    // 6. Handle discard/equipment
    // Non equipment cards are discarded after their effect is triggered.
    //Equipment cards need to go to the particular player equipment array, so
    //they are not discarded. Where exactly the equipment card goes after being
    //played is decided by their effect function.
    const isEquipment = cardMeta.effect.isEquipment;
    if (!isEquipment) {
      this.stateController.cardCtrl.discardCard(cardId);
    }
  }

  private triggerCardEffect(
    cardId: string,
    cardMeta: PlayingCardMeta,
    player: Player,
    targetPlayer?: Player,
  ) {
    if (cardMeta.effect.target === "one" && !targetPlayer) {
      throw new Error(
        `Effect for ${cardId} requires a targetPlayer, but got none`,
      );
    }

    if (cardMeta.effect.target !== "one" && targetPlayer) {
      console.warn(
        `Effect for ${cardId} received targetPlayer, but does not require one`,
      );
    }

    const cardEffectFunctionName = cardId
      .split("_")
      .slice(0, -1)
      .join("_")
      .toUpperCase();

    const effect: EffectHandler = CARD_EFFECTS_REGISTRY[cardEffectFunctionName];

    if (!effect) {
      throw new Error(
        `Failed to find corresponding effect function for ${cardId}`,
      );
    }

    effect({ game: this.game, player, targetPlayer, cardId });
  }
}
