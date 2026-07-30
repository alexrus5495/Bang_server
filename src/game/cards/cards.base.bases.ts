import type { PlayingCardMeta } from "../../types.js";

export const bangBase: Omit<PlayingCardMeta, "rankAndSuit" | "cardInstanceId"> =
  {
    cardTypeId: "bang",
    image: "bang_1",
    borderColor: "yellow",
    borderType: "base",
    decorations: ["bullet_holes"],
    description: [
      [
        { type: "symbol", key: "bang" },
        { type: "symbol", key: "any_in_range" },
      ],
    ],
    tooltipIcon: false,
    pack: "base",
    effect: {
      target: "one",
      range: "inherit",
      isEquipment: false,
    },
  };

export const barrelBase: Omit<
  PlayingCardMeta,
  "rankAndSuit" | "cardInstanceId"
> = {
  cardTypeId: "barrel",
  image: "barrel",
  borderColor: "blue",
  borderType: "base",
  decorations: ["bullet_holes"],
  description: [
    [
      { type: "symbol", key: "range_hearts" },
      { type: "symbol", key: "equals" },
      { type: "symbol", key: "miss" },
    ],
  ],
  tooltipIcon: false,
  pack: "base",
  effect: {
    target: "self",
    range: "none",
    isEquipment: true,
  },
};

export const beerBase: Omit<PlayingCardMeta, "rankAndSuit" | "cardInstanceId"> =
  {
    cardTypeId: "beer",
    image: "beer",
    borderColor: "yellow",
    borderType: "base",
    decorations: ["bullet_holes"],
    description: [[{ type: "symbol", key: "heal" }]],
    tooltipIcon: false,
    pack: "base",
    effect: {
      target: "self",
      range: "none",
      isEquipment: false,
    },
  };

export const cat_balouBase: Omit<
  PlayingCardMeta,
  "rankAndSuit" | "cardInstanceId"
> = {
  cardTypeId: "cat_balou",
  image: "cat_balou",
  borderColor: "yellow",
  borderType: "base",
  decorations: ["bullet_holes"],
  description: [
    [
      { type: "symbol", key: "discard" },
      { type: "symbol", key: "any" },
    ],
  ],
  tooltipIcon: false,
  pack: "base",
  effect: { target: "one", range: "none", isEquipment: false },
};

export const duelBase: Omit<PlayingCardMeta, "rankAndSuit" | "cardInstanceId"> =
  {
    cardTypeId: "duel",
    image: "duel",
    borderColor: "yellow",
    borderType: "base",
    decorations: ["bullet_holes"],
    description: [[{ type: "text", key: "duel" }]],
    tooltipIcon: true,
    pack: "base",
    effect: { target: "one", range: "none", isEquipment: false },
  };

export const dynamiteBase: Omit<
  PlayingCardMeta,
  "rankAndSuit" | "cardInstanceId"
> = {
  cardTypeId: "dynamite",
  image: "dynamite",
  borderColor: "blue",
  borderType: "base",
  decorations: ["bullet_holes"],
  description: [
    [
      { type: "symbol", key: "range_spades_2-9" },
      { type: "symbol", key: "equals" },
      { type: "text", key: "dynamite" },
    ],
  ],
  tooltipIcon: true,
  pack: "base",
  effect: { target: "self", range: "none", isEquipment: true },
};

export const gatlingBase: Omit<
  PlayingCardMeta,
  "rankAndSuit" | "cardInstanceId"
> = {
  cardTypeId: "gatling",
  image: "gatling",
  borderColor: "yellow",
  borderType: "base",
  decorations: ["bullet_holes"],
  description: [
    [
      { type: "symbol", key: "bang" },
      { type: "symbol", key: "all" },
    ],
  ],
  tooltipIcon: false,
  pack: "base",
  effect: { target: "many", range: "none", isEquipment: false },
};

export const general_storeBase: Omit<
  PlayingCardMeta,
  "rankAndSuit" | "cardInstanceId"
> = {
  cardTypeId: "general_store",
  image: "general_store",
  borderColor: "yellow",
  borderType: "base",
  decorations: ["bullet_holes"],
  description: [[{ type: "text", key: "general_store" }]],
  tooltipIcon: true,
  pack: "base",
  effect: { target: "all", range: "none", isEquipment: false },
};

export const indiansBase: Omit<
  PlayingCardMeta,
  "rankAndSuit" | "cardInstanceId"
> = {
  cardTypeId: "indians",
  image: "indians",
  borderColor: "yellow",
  borderType: "base",
  decorations: ["bullet_holes"],
  description: [[{ type: "text", key: "indians" }]],
  tooltipIcon: true,
  pack: "base",
  effect: { target: "many", range: "none", isEquipment: false },
};

export const jailBase: Omit<PlayingCardMeta, "rankAndSuit" | "cardInstanceId"> =
  {
    cardTypeId: "jail",
    image: "jail",
    borderColor: "blue",
    borderType: "base",
    decorations: ["bullet_holes"],
    description: [
      [
        { type: "symbol", key: "range_hearts" },
        { type: "symbol", key: "equals" },
        { type: "text", key: "jail" },
      ],
    ],
    tooltipIcon: true,
    pack: "base",
    effect: {
      target: "one",
      range: "none",
      isEquipment: true,
    },
  };

export const missedBase: Omit<
  PlayingCardMeta,
  "rankAndSuit" | "cardInstanceId"
> = {
  cardTypeId: "missed",
  image: "missed",
  borderColor: "yellow",
  borderType: "base",
  decorations: ["bullet_holes"],
  description: [[{ type: "symbol", key: "miss" }]],
  tooltipIcon: false,
  pack: "base",
  effect: { target: "self", range: "none", isEquipment: false },
};

export const mustangBase: Omit<
  PlayingCardMeta,
  "rankAndSuit" | "cardInstanceId"
> = {
  cardTypeId: "mustang",
  image: "mustang",
  borderColor: "blue",
  borderType: "base",
  decorations: ["bullet_holes"],
  description: [[{ type: "text", key: "mustang" }]],
  tooltipIcon: false,
  pack: "base",
  effect: { target: "self", range: "none", isEquipment: true },
};

export const panicBase: Omit<
  PlayingCardMeta,
  "rankAndSuit" | "cardInstanceId"
> = {
  cardTypeId: "panic",
  image: "panic",
  borderColor: "yellow",
  borderType: "base",
  decorations: ["bullet_holes"],
  description: [
    [
      { type: "symbol", key: "draw" },
      { type: "symbol", key: "one" },
    ],
  ],
  tooltipIcon: false,
  pack: "base",
  effect: { target: "one", range: 1, isEquipment: false },
};

export const saloonBase: Omit<
  PlayingCardMeta,
  "rankAndSuit" | "cardInstanceId"
> = {
  cardTypeId: "saloon",
  image: "saloon",
  borderColor: "yellow",
  borderType: "base",
  decorations: ["bullet_holes"],
  description: [
    [
      { type: "symbol", key: "heal" },
      { type: "symbol", key: "all" },
    ],
    [{ type: "symbol", key: "heal" }],
  ],
  tooltipIcon: false,
  pack: "base",
  effect: { target: "all", range: "none", isEquipment: false },
};

export const scopeBase: Omit<
  PlayingCardMeta,
  "rankAndSuit" | "cardInstanceId"
> = {
  cardTypeId: "scope",
  image: "scope",
  borderColor: "blue",
  borderType: "base",
  decorations: ["bullet_holes"],
  description: [[{ type: "text", key: "scope" }]],
  tooltipIcon: false,
  pack: "base",
  effect: { target: "self", range: "none", isEquipment: true },
};

export const stagecoachBase: Omit<
  PlayingCardMeta,
  "rankAndSuit" | "cardInstanceId"
> = {
  cardTypeId: "stagecoach",
  image: "stagecoach",
  borderColor: "yellow",
  borderType: "base",
  decorations: ["bullet_holes"],
  description: [
    [
      { type: "symbol", key: "draw" },
      { type: "symbol", key: "draw" },
    ],
  ],
  tooltipIcon: false,
  pack: "base",
  effect: { target: "self", range: "none", isEquipment: false },
};

export const wells_cargoBase: Omit<
  PlayingCardMeta,
  "rankAndSuit" | "cardInstanceId"
> = {
  cardTypeId: "wells_fargo",
  image: "wells_fargo",
  borderColor: "yellow",
  borderType: "base",
  decorations: ["bullet_holes"],
  description: [
    [
      { type: "symbol", key: "draw" },
      { type: "symbol", key: "draw" },
      { type: "symbol", key: "draw" },
    ],
  ],
  tooltipIcon: false,
  pack: "base",
  effect: { target: "self", range: "none", isEquipment: false },
};

export const carabineBase: Omit<
  PlayingCardMeta,
  "rankAndSuit" | "cardInstanceId"
> = {
  cardTypeId: "carabine",
  image: "carabine",
  borderColor: "blue",
  borderType: "base",
  decorations: [],
  description: [[{ type: "symbol", key: "four" }]],
  tooltipIcon: false,
  pack: "base",
  effect: { target: "self", range: "none", isEquipment: true },
  _range: 4,
};

export const remingtonBase: Omit<
  PlayingCardMeta,
  "rankAndSuit" | "cardInstanceId"
> = {
  cardTypeId: "remington",
  image: "remington",
  borderColor: "blue",
  borderType: "base",
  decorations: [],
  description: [[{ type: "symbol", key: "three" }]],
  tooltipIcon: false,
  pack: "base",
  effect: { target: "self", range: "none", isEquipment: true },
  _range: 3,
};

export const winchesterBase: Omit<
  PlayingCardMeta,
  "rankAndSuit" | "cardInstanceId"
> = {
  cardTypeId: "winchester",
  image: "winchester",
  borderColor: "blue",
  borderType: "base",
  decorations: [],
  description: [[{ type: "symbol", key: "five" }]],
  tooltipIcon: false,
  pack: "base",
  effect: { target: "self", range: "none", isEquipment: true },
  _range: 5,
};

export const schofieldBase: Omit<
  PlayingCardMeta,
  "rankAndSuit" | "cardInstanceId"
> = {
  cardTypeId: "schofield",
  image: "schofield",
  borderColor: "blue",
  borderType: "base",
  decorations: [],
  description: [[{ type: "symbol", key: "two" }]],
  tooltipIcon: false,
  pack: "base",
  effect: { target: "self", range: "none", isEquipment: true },
  _range: 2,
};

export const volcanicBase: Omit<
  PlayingCardMeta,
  "rankAndSuit" | "cardInstanceId"
> = {
  cardTypeId: "volcanic",
  image: "volcanic",
  borderColor: "blue",
  borderType: "base",
  decorations: [],
  description: [[{ type: "text", key: "volcanic" }]],
  tooltipIcon: true,
  pack: "base",
  effect: { target: "self", range: "none", isEquipment: true },
  _range: 1,
};
