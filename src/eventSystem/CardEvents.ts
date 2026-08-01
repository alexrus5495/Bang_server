import type { EventSystem } from "./eventSystem.js";
import { CardEffectFailReasons } from "./types.js";

export class CardEvents {
  constructor(private eventSystem: EventSystem) {}

  drawn(playerId: string, cardId: string, cardIndex: number) {
    this.eventSystem.register("CARD_DRAWN", {
      playerId,
      card: {
        id: cardId,
        index: cardIndex,
      },
      visibleTo: [playerId],
    });
  }

  discarded(playerId: string, cardId: string, cardIndex: number) {
    const visibleTo: string[] = [playerId];
    this.eventSystem.register("CARD_DISCARDED", {
      playerId,
      card: { id: cardId, index: cardIndex },
      visibleTo,
    });
  }

  played(playerId: string, cardId: string, cardIndex: number) {
    this.eventSystem.register("CARD_PLAYED", {
      playerId,
      card: {
        id: cardId,
        index: cardIndex,
      },
    });
  }

  equipped(data: {
    playerId: string;
    cardId: string;
    cardIndex: number;
    isWeapon?: boolean;
    range?: number;
  }) {
    const card: {
      id: string;
      index: number;
      isWeapon?: boolean;
      range?: number;
    } = {
      id: data.cardId,
      index: data.cardIndex,
    };

    if (data.isWeapon) card.isWeapon = data.isWeapon;
    if (data.range) card.range = data.range;

    this.eventSystem.register("CARD_EQUIPPED", {
      playerId: data.playerId,
      card,
    });
  }

  unequipped(data: {
    playerId: string;
    cardId: string;
    cardIndex: number;
    isWeapon?: boolean;
  }) {
    const card: {
      id: string;
      index: number;
      isWeapon?: boolean;
    } = {
      id: data.cardId,
      index: data.cardIndex,
    };

    if (data.isWeapon) card.isWeapon = data.isWeapon;

    this.eventSystem.register("CARD_UNEQUIPPED", {
      playerId: data.playerId,
      card,
    });
  }

  tableCleared() {
    this.eventSystem.register("TABLE_CLEARED", null);
  }

  effectFailed({
    playerId,
    cardId,
    reason,
  }: {
    playerId: string;
    cardId: string;
    reason: CardEffectFailReasons;
  }) {
    this.eventSystem.register("CARD_EFFECT_FAILED", {
      playerId,
      cardId,
      reason,
    });
  }
}
