import type { EventSystem } from "./eventSystem.js";

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

  played(playerId: string, cardId: string, targetPlayerId?: string) {
    this.eventSystem.register("CARD_PLAYED", {
      playerId,
      cardId,
      targetPlayerId,
    });

    console.log(`Registered card played event`);
  }
}
