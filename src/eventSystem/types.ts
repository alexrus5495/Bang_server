import { ClientPlayer } from "../types.js";

export interface GameEvent {
  id: number;
  type: keyof EventType;
  data: EventType[keyof EventType];
  timestamp: Date;
}

export interface EventType {
  // Pre-launch events
  GAME_CREATED: { gameId: string; deckSize: number; numberOfSeats: number };
  INITIALIZATION_STARTED: null;
  PLAYER_ASSIGNED_SLOT: {
    index: number;
    playerData: Pick<ClientPlayer, "id" | "nickname" | "color" | "isAI">;
  };
  PLAYERS_SHUFFLED: { newOrder: string[] };
  PLAYER_ASSIGNED_ROLE: { playerId: string; role: string; visibleTo: string[] };

  CHAR_SELECTION_STARTED: null;
  CHAR_CARDS_DEALT: {
    playerId: string;
    options: { id: string; bullets: number }[];
  };
  PLAYER_ASSIGNED_CHAR: {
    playerId: string;
    char: string;
    health: {
      current: number;
      max: number;
    };
  };
  CHAR_SELECTION_COMPLETED: null;

  DEALING_CARDS: null;
  CARDS_DEALT: null;

  INITIALIZATION_COMPLETED: null;
  GAME_STARTED: null;

  // Game flow events
  PLAYER_TURN_START: { playerId: string };
  PLAYER_DRAWING_START: { playerId: string };
  PLAYER_DRAWING_END: { playerId: string };
  PLAYER_PLAYING_START: { playerId: string };
  PLAYER_PLAYING_END: { playerId: string };
  PLAYER_DISCARDING_START: { playerId: string };
  PLAYER_DISCARDING_END: { playerId: string };
  PLAYER_TURN_END: { playerId: string };

  // Player utility events
  PLAYER_HEALED: { playerId: string; amount: number; newHealth: number };
  MASS_PLAYER_HEALED: {
    targets: Array<{ playerId: string; amount: number; newHealth: number }>;
  };
  PLAYER_DAMAGED: { playerId: string; amount: number; newHealth: number };
  MASS_PLAYER_DAMAGED: {
    targets: Array<{ playerId: string; amount: number; newHealth: number }>;
  };
  PLAYER_ELIMINATED: { playerId: string };

  // General Store game events
  STORE_INITIATED: { playersOrder: string[] };
  STORE_CARD_ADDED: { cardId: string; index: number };
  STORE_READY: null;
  STORE_CARD_PICKED: { cardId: string; playerId: string; cardIndex: number };
  STORE_NEXT_PICKER: { playerId: string };
  STORE_CLOSED: null;

  // Card events
  CARD_DRAWN: {
    playerId: string;
    card: {
      id: string;
      index: number;
    };
    visibleTo: string[];
  };
  CARD_DISCARDED: {
    playerId: string;
    card: {
      id: string;
      index: number;
    };
    visibleTo: string[];
  };
  CARD_PLAYED: {
    playerId: string;
    card: {
      id: string;
      index: number;
    };
  };
  CARD_EQUIPPED: {
    playerId: string;
    card: {
      id: string;
      index: number;
      isWeapon?: boolean;
      range?: number;
    };
  };
  CARD_UNEQUIPPED: {
    playerId: string;
    card: {
      id: string;
      index: number;
      isWeapon?: boolean;
    };
  };
  TABLE_CLEARED: null;
  CARD_EFFECT_FAILED: {
    playerId: string;
    cardId: string;
    reason: CardEffectFailReasons;
  };
}

export type CardEffectFailReasons = "HEALTH_FULL" | "TWO_PEOPLE_LEFT";
