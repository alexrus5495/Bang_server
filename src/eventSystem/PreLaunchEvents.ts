import type { EventSystem } from "./eventSystem.js";

export class PreLaunchEvents {
  constructor(private eventSystem: EventSystem) {}

  gameCreated(data: {
    gameId: string;
    deckSize: number;
    numberOfSeats: number;
  }) {
    this.eventSystem.register("GAME_CREATED", data);
  }

  initializationStarted() {
    this.eventSystem.register("INITIALIZATION_STARTED", null);
  }

  initializationCompleted() {
    this.eventSystem.register("INITIALIZATION_COMPLETED", null);
  }

  dealingCards() {
    this.eventSystem.register("DEALING_CARDS", null);
  }

  cardsDealt() {
    this.eventSystem.register("CARDS_DEALT", null);
  }

  charSelectionStarted() {
    this.eventSystem.register("CHAR_SELECTION_STARTED", null);
  }

  charSelectionCompleted() {
    this.eventSystem.register("CHAR_SELECTION_COMPLETED", null);
  }

  charCardsDealt(playerId: string, options: { id: string; bullets: number }[]) {
    this.eventSystem.register("CHAR_CARDS_DEALT", { playerId, options });
  }

  gameStarted() {
    this.eventSystem.register("GAME_STARTED", null);
  }
}
