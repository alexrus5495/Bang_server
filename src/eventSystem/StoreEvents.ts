import { EventSystem } from "./eventSystem.js";

export class StoreEvents {
  constructor(private eventSystem: EventSystem) {}

  initiated(playersOrder: string[]) {
    this.eventSystem.register("STORE_INITIATED", { playersOrder });
  }

  cardAdded(cardId: string, index: number) {
    this.eventSystem.register("STORE_CARD_ADDED", { cardId, index });
  }

  ready() {
    this.eventSystem.register("STORE_READY", null);
  }

  cardPicked(playerId: string, cardId: string, cardIndex: number) {
    this.eventSystem.register("STORE_CARD_PICKED", {
      cardId,
      playerId,
      cardIndex,
    });
  }

  nextPicker(playerId: string) {
    this.eventSystem.register("STORE_NEXT_PICKER", { playerId });
  }

  closed() {
    this.eventSystem.register("STORE_CLOSED", null);
  }
}
