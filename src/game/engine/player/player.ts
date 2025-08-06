import { WEAPON_LIST } from "../cards/weaponList.js";

export class Player {
  public nickname: string;
  public role: string;
  public char: string;
  public hand: string[];
  public equipment: string[];
  public flags: {
    isPlayerAssigned: boolean;
    isRoleReady: boolean;
    isCharReady: boolean;
    isEliminated: boolean;
    isUnderSight: boolean;
    isLimitedToBang: false | "duel" | "indians";
    isAi: boolean;
  };
  public stats: {
    health: { current: number; max: number };
    bangCardsPlayed: number;
    bangCardsPlayedLimit: number;
  };
  public _charOptions: { id: string; bullets: number }[];

  constructor() {
    this.nickname = "";
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
      isAi: false,
    };
    this.stats = {
      bangCardsPlayed: 0,
      bangCardsPlayedLimit: 1,
      health: {
        current: 0,
        max: 0,
      },
    };
    this._charOptions = [];
  }
  get range() {
    return this.calculateRange();
  }

  get publicData() {
    return {
      flags: {
        isEliminated: this.flags.isEliminated,
        isAI: this.flags.isAi,
      },
      stats: this.stats,
    };
  }

  public assingPlayer(nickname: string, isAI: boolean = false) {
    this.nickname = nickname;
    if (isAI) this.flags.isAi = true;
    this.flags.isPlayerAssigned = true;
  }

  public assignRole(roleCardId: string) {
    this.role = roleCardId;
    this.flags.isRoleReady = true;
  }

  public pickCharCard(option: 0 | 1) {
    const char = this._charOptions[option];
    this.char = char.id;

    this.stats.health.max =
      this.role === "sheriff" ? char.bullets + 1 : char.bullets;

    this.stats.health.current = this.stats.health.max;

    this.flags.isCharReady = true;
  }

  public takeDamage(damage: number) {
    const currentHealth = this.stats.health.current;

    let newHealth = currentHealth - damage;
    if (newHealth < 0) newHealth = 0;

    if (newHealth === 0) this.flags.isEliminated = true;
  }

  private calculateRange() {
    //Find weapon card
    for (const card of this.equipment) {
      const cardId = card.split("_")[0];
      if (WEAPON_LIST.has(cardId)) return WEAPON_LIST.get(cardId);
    }
    return 1;
  }
}
