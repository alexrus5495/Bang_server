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
  INITIALIZATION_COMPLETED: null;
  DEALING_CARDS: null;
  CARDS_DEALT: null;
  GAME_STARTED: null;
  PLAYER_ASSIGNED_SLOT: {
    index: number;
    playerData: Pick<ClientPlayer, "id" | "nickname" | "color" | "isAI">;
  };
  PLAYERS_SHUFFLED: { newOrder: string[] };
  PLAYER_ASSIGNED_ROLE: { playerId: string; role: string; visibleTo: string[] };
  PLAYER_ASSIGNED_CHAR: {
    playerId: string;
    char: string;
    health: {
      current: number;
      max: number;
    };
  };

  // Game flow events
  PLAYER_TURN_START: { playerId: string };
  PLAYER_DRAWING_START: { playerId: string };
  PLAYER_DRAWING_END: { playerId: string };
  PLAYER_PLAYING_START: { playerId: string };
  PLAYER_PLAYING_END: { playerId: string };
  PLAYER_DISCARDING_START: { playerId: string };
  PLAYER_DISCARDING_END: { playerId: string };
  PLAYER_TURN_END: { playerId: string };

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
}
