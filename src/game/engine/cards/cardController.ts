import type { CharacterCardMeta, PlayingCardMeta } from "../../../types.js";
import type { GameState } from "../state/gameState.js";
import type { GameStateValidator } from "../state/gameStateValidator.js";
import type { Runtime } from "../runtime/runtime.js";

export class CardController {
  state: GameState;
  validator: GameStateValidator;
  runtime: Runtime;

  constructor(
    state: GameState,
    validator: GameStateValidator,
    runtime: Runtime,
  ) {
    this.state = state;
    this.validator = validator;
    this.runtime = runtime;
  }

  getCardMeta(cardId: string, deck: "deck" | "charDeck") {
    const meta = this.state[`${deck}Meta`] as Record<
      string,
      PlayingCardMeta | CharacterCardMeta
    >;

    const card = meta[cardId];

    if (!card) throw new Error(`Can't find ${cardId} in ${deck}Meta`);

    return card;
  }

  createCharOptionsSet() {
    const [optionA_id, optionB_id] = this.drawCards(2, "charDeck");
    const optionA_meta = this.getCardMeta(
      optionA_id,
      "charDeck",
    ) as CharacterCardMeta;

    const optionB_meta = this.getCardMeta(
      optionB_id,
      "charDeck",
    ) as CharacterCardMeta;

    const options = [
      { id: optionA_id, bullets: optionA_meta.bullets },
      { id: optionB_id, bullets: optionB_meta.bullets },
    ];

    return options;
  }

  discardCard(card: string) {
    this.state.discardPile.push(card);
  }

  newDeckFromDiscardPile() {
    this.state._deck.deck = this.state.discardPile;
    this.state._deck.shuffle();
    this.state.discardPile = [];
  }

  drawCards(
    cardsToDraw: number,
    deck: "deck" | "roleDeck" | "charDeck" = "deck",
  ) {
    const drawnCards = [];

    for (let i = 1; i <= cardsToDraw; i++) {
      if (deck === "deck" && this.validator.isDeckEmpty)
        this.newDeckFromDiscardPile();

      drawnCards.push(this.state[deck].shift() as string);

      if (deck === "deck" && this.validator.isDeckEmpty)
        this.newDeckFromDiscardPile();
    }

    return drawnCards;
  }
}
