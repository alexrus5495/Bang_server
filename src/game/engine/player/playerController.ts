import type { Role } from "../../../types.js";
import type { GameState } from "../state/gameState.js";
import type { GameStateValidator } from "../state/gameStateValidator.js";
import type { Player } from "./player.js";
import type { Runtime } from "../runtime/runtime.js";
import { promiseKeys } from "../runtime/runtimeKeys.js";
import { WEAPON_LIST } from "../cards/weaponList.js";

export class PlayerController {
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

  get currentPlayer() {
    return this.state.currentPlayer;
  }

  addCardsToTheHand(player: Player, cards: string[]) {
    player.hand.push(...cards);
  }

  addCardToEquipment(player: Player, card: string) {
    player.equipment.push(card);
  }

  assignToAnEmptySlot(nickname: string) {
    for (let i = 0; i <= this.state.players.length - 1; i++) {
      const player = this.state.players[i];

      if (!player.flags.isPlayerAssigned) {
        player.assingPlayer(nickname);
        break;
      }
    }

    if (this.validator.isAllPlayersAssigned) {
      this.shufflePlayers();
      this.runtime.resolveRuntimePromise(promiseKeys.allPlayersAssigned, true);
    }
  }

  assignRole(player: Player, roleCardId: string) {
    player.assignRole(roleCardId);
  }

  doForEachPlayer(callback: (player: Player, index: number) => void) {
    const activePlayers = this.getActivePlayers();
    activePlayers.forEach((player, index) => callback(player, index));
  }

  async doAsyncForAllOtherPlayers(
    excludedPlayer: Player,
    callback: (player: Player, index: number) => Promise<void>,
  ) {
    const activePlayers = this.getActivePlayers();
    const promises = activePlayers
      .map((player, index) => {
        if (player === excludedPlayer) return null;
        return callback(player, index);
      })
      .filter(Boolean) as Promise<void>[];
    await Promise.all(promises);
  }

  removeCardFromHand(cardIndex: number, player: Player) {
    if (cardIndex < 0 || cardIndex >= player.hand.length)
      throw new Error("Invalid index");

    const [card] = player.hand.splice(cardIndex, 1);
    return card;
  }

  removeWholeHand(player: Player) {
    const hand = player.hand;
    player.hand = [];
    return hand;
  }

  removeAllEquipment(player: Player) {
    const equipment = player.equipment;
    player.equipment = [];
    return equipment;
  }

  removeEquipmentCard(cardIndex: number, player: Player) {
    if (cardIndex < 0 || cardIndex >= player.equipment.length)
      throw new Error("Invalid index");

    const [card] = player.equipment.splice(cardIndex, 1);
    return card;
  }

  getActivePlayers() {
    return this.state.players.filter((player) => !player.flags.isEliminated);
  }

  getMaxHealth(player: Player) {
    return player.stats.health.max;
  }

  getNextPlayerFrom(player: Player) {
    if (player.flags.isEliminated)
      throw new Error(
        "Calling getNextPlayerFrom with a player that have isEliminated flag",
      );

    if (this.validator.playersActive < 2) {
      throw new Error(
        "Trying to find next player with less than two active players left",
      );
    }

    const activePlayers = this.getActivePlayers();
    const relativeIndex = activePlayers.indexOf(player);

    const nextIndex = (relativeIndex + 1) % activePlayers.length;

    return activePlayers[nextIndex];
  }

  getNewCurrentPlayer(prevPlayer: number): number {
    if (this.validator.playersActive < 2) {
      throw new Error(
        "Trying to pass turn with less than two active players left",
      );
    }

    const nextPlayer =
      prevPlayer + 1 >= this.state.players.length ? 0 : prevPlayer + 1;

    if (this.state.players[nextPlayer].flags.isEliminated) {
      return this.getNewCurrentPlayer(nextPlayer);
    } else return nextPlayer;
  }

  getPlayer(index: number) {
    if (this.state.players[index]) {
      return this.state.players[index];
    } else {
      throw new Error("No player with such index");
    }
  }

  getPlayersByRole(role: Role) {
    return this.state.getPlayersByRole(role);
  }

  getPlayersIndex(player: Player) {
    return this.state.players.indexOf(player);
  }

  savePlayerByRole(player: Player, role: Role) {
    this.state.roles[role].push(player);
  }

  shufflePlayers() {
    const result = [...this.state.players];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    this.state.players = result;
  }

  setChar(player: Player, option: 0 | 1) {
    player.pickCharCard(option);
    if (this.validator.isAllCharsAssigned) {
      this.runtime.resolveRuntimePromise(promiseKeys.charSelection, true);
    }
  }

  setCharOptions(player: Player, options: { id: string; bullets: number }[]) {
    player._charOptions = options;
  }

  setCurrentPlayer(index: number) {
    this.state.currentPlayer = index;
  }

  resetBangCounter(player: Player) {
    player.stats.bangCardsPlayed = 0;
  }

  heal(player: Player, amount: number) {
    const currentHealth = player.stats.health.current;
    const maxHealth = player.stats.health.max;

    let newHealth = currentHealth + amount;
    if (newHealth > maxHealth) newHealth = maxHealth;

    player.stats.health.current = newHealth;
  }

  _doesHaveEquipmentCard(player: Player, cardPrefix: string) {
    const cardRegex = new RegExp(`^${cardPrefix}_\\d+$`);
    return player.equipment.some((item) => cardRegex.test(item));
  }

  _findEquipmentCardIndex(player: Player, cardPrefix: string) {
    const foundCard = player.equipment.find((item) =>
      item.startsWith(cardPrefix + "_"),
    );

    if (foundCard) {
      return player.equipment.indexOf(foundCard);
    }

    return undefined;
  }

  _findWeapon(player: Player) {
    /** @returns index of a weapon card in Player's equipment if Player has any
     * @returns undefined if Player has no weapon cards
     **/
    for (const weapon of WEAPON_LIST) {
      const weaponName = weapon[0];
      const foundCard = player.equipment.find((item) =>
        item.startsWith(weaponName + "_"),
      );

      if (foundCard) {
        return player.equipment.indexOf(foundCard);
      }
    }
    return undefined;
  }
}
