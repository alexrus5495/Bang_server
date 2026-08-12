import type {
  CharacterCardMeta,
  PlayingCardMeta,
  RoleCardMeta,
} from "../../../types.js";
import { PendingInteraction } from "../../interaction/interactionController.js";
import type { Deck } from "../cards/deck.js";
import type { Player } from "../player/player.js";

export class GameState {
  _deck: Deck;
  totalCardsInGame: number;
  private _charDeck: Deck;
  private _roleDeck: Deck;
  discardPile: string[];
  players: Player[];
  roles: Record<string, Player[]>;
  currentPlayer: number;
  pendingInteraction: PendingInteraction;

  constructor(deck: Deck, charDeck: Deck, roleDeck: Deck, players: Player[]) {
    this._deck = deck;
    this.totalCardsInGame = this._deck.deck.length;
    this._charDeck = charDeck;
    this._roleDeck = roleDeck;
    this.players = players;
    this.currentPlayer = 0;
    this.discardPile = [];
    this.roles = {
      sheriff: [],
      outlaw: [],
      deputy: [],
      renegade: [],
    };
    this.pendingInteraction = null;
  }

  public get deck(): string[] {
    return this._deck.deck;
  }

  public get deckMeta() {
    return this._deck.meta as Record<string, PlayingCardMeta>;
  }

  public get charDeck(): string[] {
    return this._charDeck.deck;
  }

  public get charDeckMeta() {
    return this._charDeck.meta as Record<string, CharacterCardMeta>;
  }

  public get roleDeck(): string[] {
    return this._roleDeck.deck;
  }

  public get roleDeckMeta() {
    return this._roleDeck.meta as Record<string, RoleCardMeta>;
  }

  public getPlayersByRole(role: string) {
    return this.roles[role];
  }
}
