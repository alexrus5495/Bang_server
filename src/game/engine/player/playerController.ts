import type { Role } from "../../../types.js";
import type { GameState } from "../state/gameState.js";
import type { GameStateValidator } from "../state/gameStateValidator.js";
import type { Player } from "./player.js";
import type { Runtime } from "../runtime/runtime.js";

export class PlayerController {
  id: string;
  state: GameState;
  validator: GameStateValidator;
  runtime: Runtime;

  constructor(
    id: string,
    state: GameState,
    validator: GameStateValidator,
    runtime: Runtime,
  ) {
    this.id = id;
    this.state = state;
    this.validator = validator;
    this.runtime = runtime;
  }

  get currentPlayer() {
    return this.state.currentPlayer;
  }

  addCardsToTheHand(player: Player, cards: string[]) {
    player.addCardsToTheHand(cards);
  }

  addCardToEquipment(player: Player, card: string) {
    player.addCardsToEquipment(card);
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
    const card = player.removeCard("hand", cardIndex);
    return card;
  }

  removeWholeHand(player: Player) {
    const card = player.removeAllCards("hand");
    return card;
  }

  removeAllEquipment(player: Player) {
    const removedCards = player.removeAllCards("equipment");
    return removedCards;
  }

  removeEquipmentCard(cardIndex: number, player: Player) {
    const card = player.removeCard("equipment", cardIndex);
    return card;
  }

  getActivePlayers() {
    return this.state.players.filter((player) => !player.isEliminated);
  }

  getMaxHealth(player: Player) {
    return player.maxHealth;
  }

  getHand(player: Player) {
    return player.hand;
  }

  getNextPlayerFrom(player: Player) {
    if (player.isEliminated)
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

    if (this.state.players[nextPlayer].isEliminated) {
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

  getPlayerById(id: string) {
    return this.state.players.find((player) => player.id === id);
  }

  getPlayersByRole(role: Role) {
    return this.state.getPlayersByRole(role);
  }

  getPlayersIndex(player: Player) {
    return this.state.players.indexOf(player);
  }

  setCurrentPlayer(index: number) {
    this.state.currentPlayer = index;
  }

  resetBangCounter(player: Player) {
    player.resetBangCounter();
  }

  heal(player: Player, amount: number) {
    player.heal(amount);
  }

  hasEquipmentCard(player: Player, cardPrefix: string) {
    return player.hasEquipmentCard(cardPrefix);
  }

  getEquipmentCardIndex(player: Player, cardPrefix: string) {
    return player.getEquipmentCardIndex(cardPrefix);
  }

  getEquipmentCardId(player: Player, index: number) {
    return player.getEquipmentCardId(index);
  }

  getCurrentWeaponIndex(player: Player) {
    return player.currentWeaponIndex;
  }

  equipWeapon(player: Player, newWeaponCardId: string) {
    // 1. Check if the player has any other weapon equipped and remove it
    const currentWeaponIndex = this.getCurrentWeaponIndex(player);

    let unequippedWeaponId: string | undefined;

    if (currentWeaponIndex !== undefined) {
      unequippedWeaponId = this.getEquipmentCardId(player, currentWeaponIndex);
      this.removeEquipmentCard(currentWeaponIndex, player);
    }

    // 2. Equip new weapon
    this.addCardToEquipment(player, newWeaponCardId);

    const newWeaponIndex = this.getCurrentWeaponIndex(player);
    if (newWeaponIndex === undefined) {
      throw new Error(
        `Failed to find index for newly equipped weapon: ${newWeaponCardId}`,
      );
    }

    return {
      unequippedWeaponId,
      unequippedIndex: currentWeaponIndex,
      newWeaponIndex,
      newWeaponRange: player.weapon.range,
    };
  }

  equipCard(player: Player, cardId: string) {
    // 1. Check if the player already has the same card type equipped and remove it
    const cardPrefix = cardId.split("_").slice(0, -1).join("_").toUpperCase();
    const currentEquippedCardIndex = this.getEquipmentCardIndex(
      player,
      cardPrefix,
    );

    let unequippedCardId: string | undefined;

    if (currentEquippedCardIndex !== undefined) {
      unequippedCardId = this.getEquipmentCardId(
        player,
        currentEquippedCardIndex,
      );
      this.removeEquipmentCard(currentEquippedCardIndex, player);
    }

    // 2. Equip new card
    this.addCardToEquipment(player, cardId);

    const newEquippedCardIndex = this.getEquipmentCardIndex(player, cardPrefix);
    if (newEquippedCardIndex === undefined) {
      throw new Error(
        `Failed to find index for newly equipped card: ${cardId}`,
      );
    }

    return {
      unequippedCardId,
      unequippedCardIndex: currentEquippedCardIndex,
      newCardIndex: newEquippedCardIndex,
    };
  }
}
