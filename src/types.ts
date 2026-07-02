import { BORDER_COLORS, BORDER_TYPES } from "./config/borders.config.js";
import type { CARDPACKS } from "./config/cardpacks.js";
import type { CARD_DECORATIONS } from "./config/decorations.config.js";

type Suit = "clubs" | "diamonds" | "hearts" | "spades";
export type Role = "sheriff" | "deputy" | "outlaw" | "renegade";

export interface RankAndSuit {
  rank: string;
  suit: Suit;
}

export type BorderColor = keyof typeof BORDER_COLORS;
export type BorderType = (typeof BORDER_TYPES)[number];
type Decoration = (typeof CARD_DECORATIONS)[number];
type DecorationsList = Decoration[];

export type DescriptionContentBlock =
  | { type: "text"; key: string }
  | { type: "divider"; key: string }
  | { type: "symbol"; key: string };

type DescriptionLine = DescriptionContentBlock[];
export type CardDescription = DescriptionLine[];

type CardEffectType = {
  target: "self" | "many" | "one" | "all";
  range: "none" | "inherit" | number;
  isEquipment: boolean;
};

export interface PlayingCardMeta {
  cardTypeId: string;
  cardInstanceId: string;
  rankAndSuit: RankAndSuit;
  image: string;
  borderColor: BorderColor;
  borderType: BorderType;
  decorations: DecorationsList;
  description: CardDescription;
  tooltipIcon: boolean;
  pack: (typeof CARDPACKS)[number];
  effect: CardEffectType;
  _range?: number;
}

export interface CharacterCardMeta {
  cardTypeId: string;
  bullets: number;
  image: string;
  borderColor: BorderColor;
  borderType: BorderType;
  decorations: DecorationsList;
  description: CardDescription;
  pack: (typeof CARDPACKS)[number];
}

export interface RoleCardMeta {
  cardTypeId: string;
  image: string;
  description: CardDescription;
  decorations: DecorationsList;
  borderColor: BorderColor;
  borderType: BorderType;
  pack: (typeof CARDPACKS)[number];
}

export type DeckType = "main" | "char" | "role";

export type LobbySeat = {
  id: number;
  type: "human" | "ai";
  color: string;
  status: "open" | "reserver" | "occupied";
  playerId: string;
  playerName?: string;
  isReady?: boolean;
};

export type LobbyConfig = {
  lobbyName: string;
  playerName: string;
  isPrivate: boolean;
  password: string;
  numberOfSeats: number;
  seats: LobbySeat[];
};

export type Player_Weapon = {
  card: string;
  range: number;
};

export type Player_PublicData = {
  id: string | undefined;
  isAI: boolean;
  nickname: string;
  color: string;
  char: string;
  weapon: Player_Weapon;
  role: string | undefined;
  handLength: number;
  equipment: string[];
  isEliminated: boolean;
  stats: {
    health: { current: number; max: number };
    bangCardsPlayed: number;
    bangCardsPlayedLimit: number;
  };
};

export type ClientPlayer = {
  id: string;
  isAI: boolean;
  nickname: string;
  color: string;
  role: string;
  char: string;
  hand: string[];
  equipment: string[];
  flags: {
    isEliminated: boolean;
    isUnderSight: boolean;
  };
  stats: {
    health: { current: number; max: number };
  };
};

export type PlayersPublicData = Player_PublicData[];

export type PublicData = {
  id: string;
  deckTotalSize: number;
  deckCurrentSize: number;
  discardCurrentSize: number;
  currentPlayer: number;
  playersPublicData: PlayersPublicData;
};

export type CardValidationData = {
  cardId: string;
  canPlay: boolean;
  target: "self" | "many" | "one" | "all";
  possibleTargets: string[] | null;
};
