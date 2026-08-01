import { LobbySeat, Player_PublicData } from "../../../types.js";
import { WEAPON_LIST } from "../cards/weaponList.js";
import type { ClientPlayer } from "../../../types.js";

export class Player {
  isAI: boolean | undefined;
  id: string;
  nickname: string;
  color: string | undefined;
  role: string;
  char: string;
  hand: string[];
  equipment: string[];
  flags: {
    isPlayerAssigned: boolean;
    isRoleReady: boolean;
    isCharReady: boolean;
    isEliminated: boolean;
    isUnderSight: boolean;
    isLimitedToBang: false | "duel" | "indians";
  };
  stats: {
    health: { current: number; max: number };
    bangCardsPlayed: number;
    bangCardsPlayedLimit: number;
  };
  charOptions: { id: string; bullets: number }[];

  constructor() {
    this.isAI = undefined;
    this.id = "";
    this.nickname = "";
    this.color = undefined;
    this.role = "";
    this.char = "";
    this.hand = [];
    this.equipment = [];
    this.flags = {
      isPlayerAssigned: false,
      isRoleReady: false,
      isCharReady: false,
      isEliminated: false,
      isUnderSight: false,
      isLimitedToBang: false,
    };
    this.stats = {
      bangCardsPlayed: 0,
      bangCardsPlayedLimit: 1,
      health: {
        current: 0,
        max: 0,
      },
    };
    this.charOptions = [];
  }

  get weapon() {
    let weaponCard = "colt45";
    let weaponRange = 1;

    //Find weapon card
    for (const cardId of this.equipment) {
      const cardPrefix = cardId.split("_").slice(0, -1).join("_");
      if (WEAPON_LIST.has(cardPrefix)) {
        weaponCard = cardId;
        weaponRange = WEAPON_LIST.get(cardPrefix) as number;
      }
    }

    return {
      card: weaponCard,
      range: weaponRange,
    };
  }

  get isEliminated() {
    return this.flags.isEliminated;
  }

  get maxHealth() {
    return this.stats.health.max;
  }

  getAssignedData(): Pick<ClientPlayer, "id" | "nickname" | "color" | "isAI"> {
    return {
      id: this.id!,
      nickname: this.nickname,
      color: this.color!,
      isAI: this.isAI!,
    };
  }

  getRoleData(): Pick<ClientPlayer, "role"> {
    return { role: this.role };
  }

  getCharData(): Pick<ClientPlayer, "char" | "stats"> {
    return {
      char: this.char,
      stats: { health: { ...this.stats.health } },
    };
  }

  get publicData(): Player_PublicData {
    return {
      id: this.id,
      isAI: this.isAI as boolean,
      nickname: this.nickname,
      color: this.color as string,
      weapon: this.weapon,
      role:
        this.role === "sheriff"
          ? this.role
          : this.isEliminated
            ? this.role
            : undefined,
      char: this.char,
      handLength: this.hand.length,
      equipment: this.equipment,
      isEliminated: this.flags.isEliminated,
      stats: this.stats,
    };
  }

  assingPlayer(playerData: LobbySeat) {
    this.nickname = playerData.playerName as string;
    this.id = playerData.playerId;
    this.color = playerData.color;
    this.isAI = playerData.type === "ai";
    this.flags.isPlayerAssigned = true;
  }

  assignRole(roleCardId: string) {
    this.role = roleCardId;
    this.flags.isRoleReady = true;
  }

  pickCharCard(option: 0 | 1) {
    const char = this.charOptions[option];
    this.char = char.id;

    this.stats.health.max =
      this.role === "sheriff" ? char.bullets + 1 : char.bullets;

    this.stats.health.current = this.stats.health.max;

    this.flags.isCharReady = true;
  }

  takeDamage(damage: number) {
    const currentHealth = this.stats.health.current;

    let newHealth = currentHealth - damage;

    this.stats.health.current = newHealth;
    if (newHealth === 0) this.flags.isEliminated = true;
  }

  addCardsToTheHand(cards: string[]) {
    this.hand.push(...cards);
  }

  addCardsToEquipment(card: string) {
    this.equipment.push(card);
  }

  removeCard(from: "hand" | "equipment", cardIndex: number) {
    if (cardIndex < 0 || cardIndex >= this[from].length)
      throw new Error("Invalid index");

    const card = this[from][cardIndex];
    this[from] = this[from].filter((_, index) => index !== cardIndex);
    return card;
  }

  removeAllCards(from: "hand" | "equipment") {
    const removedCards = [...this[from]];
    this[from] = [];
    return removedCards;
  }

  heal(amount: number) {
    const currentHealth = this.stats.health.current;
    const maxHealth = this.stats.health.max;

    let newHealth = currentHealth + amount;
    if (newHealth > maxHealth) newHealth = maxHealth;

    this.stats.health.current = newHealth;
  }

  hasEquipmentCard(cardPrefix: string) {
    const foundCard = this.equipment.find((item) =>
      item.startsWith(cardPrefix + "_"),
    );
    return foundCard ? true : false;
  }

  getEquipmentCardIndex(cardPrefix: string) {
    const foundCard = this.equipment.find((item) =>
      item.startsWith(cardPrefix + "_"),
    );

    if (foundCard) {
      return this.equipment.indexOf(foundCard);
    } else {
      return undefined;
    }
  }

  getEquipmentCardId(cardIndex: number) {
    const card = this.equipment[cardIndex];

    if (!card) throw new Error("failed to find the equipment card");

    return card;
  }

  get currentWeaponIndex() {
    /** @returns index of a weapon card in Player's equipment if Player has any
     * @returns undefined if Player has no weapon cards
     **/
    for (const [weaponName] of WEAPON_LIST) {
      const foundCard = this.equipment.find((item) =>
        item.startsWith(weaponName + "_"),
      );

      if (foundCard) {
        return this.equipment.indexOf(foundCard);
      }
    }
    return undefined;
  }

  resetBangCounter() {
    this.stats.bangCardsPlayed = 0;
  }

  incrementBangCounter() {
    this.stats.bangCardsPlayed++;
  }
}
