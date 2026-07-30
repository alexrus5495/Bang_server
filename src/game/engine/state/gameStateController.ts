import { CardController } from "../cards/cardController.js";
import type { GameState } from "./gameState.js";
import type { GameStateValidator } from "./gameStateValidator.js";
import { Player } from "../player/player.js";
import { PlayerController } from "../player/playerController.js";
import type { Runtime } from "../runtime/runtime.js";
import { promiseKeys, timerKeys } from "../runtime/runtimeKeys.js";
import type { PlayingCardMeta, Role } from "../../../types.js";
import { PlayerAssignmentService } from "../player/playerAssignmentService.js";
import { EventSystem } from "../../../eventSystem/eventSystem.js";
import { getCardRankValue } from "../../../lib/getCardRankValue.js";

export class GameStateController {
  private runtime: Runtime;
  private playerCtrl: PlayerController;
  private cardCtrl: CardController;
  private EventSystem: EventSystem;
  private handlePlayerEliminated: (
    eliminatedPlayer: Player,
    killer?: Player,
  ) => void;
  assignmentService: PlayerAssignmentService;

  constructor(
    id: string,
    state: GameState,
    validator: GameStateValidator,
    eventSystem: EventSystem,
    runtime: Runtime,
    handlePlayerEliminated: (eliminatedPlayer: Player, killer?: Player) => void,
  ) {
    this.runtime = runtime;
    this.playerCtrl = new PlayerController(id, state, validator, runtime);
    this.cardCtrl = new CardController(state, validator, runtime);
    this.handlePlayerEliminated = handlePlayerEliminated;
    this.assignmentService = new PlayerAssignmentService(
      state,
      validator,
      runtime,
      eventSystem,
    );
    this.EventSystem = eventSystem;
  }

  public readonly player = {
    getHand: (player: Player) => this.playerCtrl.getHand(player),
    addCardsToTheHand: (player: Player, cards: string[]) =>
      this.playerCtrl.addCardsToTheHand(player, cards),
    addCardToEquipment: (player: Player, card: string) =>
      this.playerCtrl.addCardToEquipment(player, card),
    applyPenaltyForSheriff: (player: Player) =>
      this.applyPenaltyForSheriff(player),
    applyRewardForOutlaw: (player: Player) => this.applyRewardForOutlaw(player),
    getCurrentPlayer: () => this.playerCtrl.currentPlayer,
    doAsyncForAllOtherPlayers: async (
      excludedPlayer: Player,
      callback: (otherPlayer: Player, index: number) => Promise<void>,
    ) =>
      await this.playerCtrl.doAsyncForAllOtherPlayers(excludedPlayer, callback),
    doDynamiteCheck: (player: Player) => this.doDynamiteCheck(player),
    doJailCheck: (player: Player) => this.doJailCheck(player),
    getActivePlayers: () => this.playerCtrl.getActivePlayers(),
    getNewCurrentPlayer: (prevPlayer: number) =>
      this.playerCtrl.getNewCurrentPlayer(prevPlayer),
    getPlayer: (index: number) => this.playerCtrl.getPlayer(index),
    getPlayerById: (id: string) => this.playerCtrl.getPlayerById(id),
    getPlayersByRole: (role: Role) => this.playerCtrl.getPlayersByRole(role),
    getPlayersIndex: (player: Player) =>
      this.playerCtrl.getPlayersIndex(player),
    getNextPlayerFrom: (player: Player) =>
      this.playerCtrl.getNextPlayerFrom(player),
    resetBangCounter: (player: Player) =>
      this.playerCtrl.resetBangCounter(player),
    removeCardFromHand: (cardIndex: number, player: Player) =>
      this.playerCtrl.removeCardFromHand(cardIndex, player),
    removeEquipmentCard: (cardIndex: number, player: Player) =>
      this.playerCtrl.removeEquipmentCard(cardIndex, player),
    setCurrentPlayer: (index: number) =>
      this.playerCtrl.setCurrentPlayer(index),
    heal: (player: Player, amount: number) =>
      this.playerCtrl.heal(player, amount),
    pickFromGeneralStore: (player: Player, cardId: string) =>
      this.pickFromGeneralStore(player, cardId),
    pickPanicCard: (
      player: Player,
      targetPlayer: Player,
      cardIndex: number,
      pickFrom: "hand" | "equipment",
      resolved?: boolean,
    ) =>
      this.pickPanicCard(player, targetPlayer, cardIndex, pickFrom, resolved),
    pickCatBalouCard: (
      targetPlayer: Player,
      cardIndex: number,
      pickFrom: "hand" | "equipment",
      resolved?: boolean,
    ) => this.pickCatBalouCard(targetPlayer, cardIndex, pickFrom, resolved),
    hasEquipmentCard: (player: Player, cardPrefix: string) =>
      this.playerCtrl.hasEquipmentCard(player, cardPrefix),
    getEquipmentCardIndex: (player: Player, cardPrefix: string) =>
      this.playerCtrl.getEquipmentCardIndex(player, cardPrefix),
    getEquipmentCardId: (player: Player, index: number) =>
      this.playerCtrl.getEquipmentCardId(player, index),
    getCurrentWeaponIndex: (player: Player) =>
      this.playerCtrl.getCurrentWeaponIndex(player),
    equipWeapon: (player: Player, weaponCardId: string) =>
      this.equipWeapon(player, weaponCardId),
    equipCard: (player: Player, cardId: string) =>
      this.equipCard(player, cardId),
  };

  public readonly deal = {
    roleCards: () => this.dealRoleCards(),
    charCards: () => this.dealCharCards(),
    playingCards: () => this.dealPlayingCards(),
  };

  public readonly cards = {
    doBarrelCheck: () => this.doBarrelCheck(),
    drawCards: (cardsToDraw: number) => this.cardCtrl.drawCards(cardsToDraw),
    drawToHand: (player: Player, cardsToDraw: number) =>
      this.drawToHand(player, cardsToDraw),
    discardCard: (card: string) => {
      this.discardCard(card);
    },
    discardFromHand: (cardIndex: number, player: Player) =>
      this.discardFromHand(cardIndex, player),
    discardEquipment: (cardIndex: number, player: Player) =>
      this.discardEquipment(cardIndex, player),
    getCardMeta: (cardId: string, deck: "deck" | "charDeck") =>
      this.cardCtrl.getCardMeta(cardId, deck),
  };

  private dealRoleCards() {
    console.log("DEALING ROLE CARDS");

    this.playerCtrl.doForEachPlayer((player, index) => {
      const roleCardId = this.cardCtrl.drawCards(1, "roleDeck")[0] as Role;

      if (!roleCardId) {
        throw new Error("Error when getting role card from the deck.");
      }

      this.assignmentService.assignRole(player, roleCardId);
      this.assignmentService.savePlayerByRole(player, roleCardId);

      if (roleCardId === "sheriff") this.playerCtrl.setCurrentPlayer(index);
    });
  }

  private dealCharCards() {
    console.log("DEALING CHAR CARDS");

    const PROMISE_NAME = promiseKeys.charSelection;
    this.runtime.setRuntimePromise(PROMISE_NAME);

    this.playerCtrl.doForEachPlayer((player, index) => {
      const options = this.cardCtrl.createCharOptionsSet();
      this.assignmentService.setCharOptions(player, options);

      //Auto assign character to AI Players
      if (player.isAI) {
        this.assignmentService.assignChar(player, 0);
        return;
      }

      if (!player.id) {
        console.error("Failed to create timer: player don't have an ID");
        return;
      }

      //Set timer to auto pick character after 1 minute.
      const TIMER_NAME = timerKeys.charSelection.replace("{index}", `${index}`);
      const TIMER_LENGTH_MS = 60000;

      this.runtime.prepareTimer(TIMER_NAME, {
        data: { userSelected: undefined },
      });

      //Handler assigns option[0] unless the players had selected any option.
      const TIMER_HANDLER = () => {
        console.log("AUTOSELECT TIMER TRIGGERED");

        const timer = this.runtime.getRuntimeTimer(TIMER_NAME);
        const selectedIndex = timer?.data?.userSelected ?? 0;

        this.assignmentService.assignChar(player, selectedIndex);
      };

      this.runtime.setBroadcastedRuntimeTimer(
        TIMER_NAME,
        TIMER_HANDLER,
        TIMER_LENGTH_MS,
        player.id,
      );
    });
  }

  private dealPlayingCards() {
    this.EventSystem.preLaunch.dealingCards();
    this.playerCtrl.doForEachPlayer((player) => {
      const cardsToDeal = this.playerCtrl.getMaxHealth(player);
      this.drawToHand(player, cardsToDeal);
    });
    this.EventSystem.preLaunch.cardsDealt();
  }

  private drawToHand(player: Player, cardsToDraw: number) {
    const cards = this.cardCtrl.drawCards(cardsToDraw);
    this.playerCtrl.addCardsToTheHand(player, cards);
    for (const card of cards) {
      const index = player.hand.indexOf(card);
      this.EventSystem.card.drawn(player.id, card, index);
    }
  }

  private discardCard(card: string) {
    this.cardCtrl.discardCard(card);
  }

  private discardFromHand(cardIndex: number, player: Player) {
    const discardedCard = this.playerCtrl.removeCardFromHand(cardIndex, player);
    this.cardCtrl.discardCard(discardedCard);
  }

  private discardEquipment(cardIndex: number, player: Player) {
    const discardedCard = this.playerCtrl.removeEquipmentCard(
      cardIndex,
      player,
    );
    this.cardCtrl.discardCard(discardedCard);
  }

  private applyPenaltyForSheriff(player: Player) {
    //Discard hand
    const hand = this.playerCtrl.removeWholeHand(player);
    hand.forEach((card) => this.cardCtrl.discardCard(card));

    //Discard equipment
    const equipment = this.playerCtrl.removeAllEquipment(player);
    equipment.forEach((card) => this.cardCtrl.discardCard(card));
  }

  private applyRewardForOutlaw(player: Player) {
    this.drawToHand(player, 3);
  }

  private doBarrelCheck() {
    const card = this.cardCtrl.drawCards(1)[0];
    const cardMeta = this.cardCtrl.getCardMeta(card, "deck") as PlayingCardMeta;
    const cardSuit = cardMeta.rankAndSuit.suit;

    return { card, isPlayerSaved: cardSuit === "hearts" };
  }

  private pickFromGeneralStore(player: Player, cardId: string) {
    this.playerCtrl.addCardsToTheHand(player, [cardId]);

    const playerIndex = this.playerCtrl.getPlayersIndex(player);
    const PROMISE_NAME = promiseKeys.general_store.replace(
      "{index}",
      `${playerIndex}`,
    );
    this.runtime.cleanupRuntimeTimer(PROMISE_NAME);
    this.runtime.resolveRuntimePromise(PROMISE_NAME, true);
  }

  private pickPanicCard(
    player: Player,
    targetPlayer: Player,
    cardIndex: number,
    pickFrom: "hand" | "equipment",
    resolved?: boolean,
  ) {
    const card =
      pickFrom === "hand"
        ? this.player.removeCardFromHand(cardIndex, targetPlayer)
        : this.player.removeEquipmentCard(cardIndex, targetPlayer);
    this.player.addCardsToTheHand(player, [card]);

    if (resolved) return;
    const PROMISE_NAME = promiseKeys.panic;
    this.runtime.resolveRuntimePromise(PROMISE_NAME, true);
  }

  private pickCatBalouCard(
    targetPlayer: Player,
    cardIndex: number,
    pickFrom: "hand" | "equipment",
    resolved?: boolean,
  ) {
    const card =
      pickFrom === "hand"
        ? this.player.removeCardFromHand(cardIndex, targetPlayer)
        : this.player.removeEquipmentCard(cardIndex, targetPlayer);
    this.cardCtrl.discardCard(card);

    if (resolved) return;

    const PROMISE_NAME = promiseKeys.cat_balou;
    this.runtime.resolveRuntimePromise(PROMISE_NAME, true);
  }

  private doDynamiteCheck(player: Player) {
    if (!this.player.hasEquipmentCard(player, "dynamite")) {
      throw new Error(
        `doDynamiteCheck was called but player doesn't have dynamite`,
      );
    }

    const drawnCard = this.cardCtrl.drawCards(1)[0];
    const drawnCardMeta = this.cardCtrl.getCardMeta(
      drawnCard,
      "deck",
    ) as PlayingCardMeta;

    const { rank, suit } = drawnCardMeta.rankAndSuit;
    const numericRank = getCardRankValue(rank);

    const willExplose =
      suit === "spades" && numericRank >= 2 && numericRank <= 9;

    const dynamiteCardIndex = this.player.getEquipmentCardIndex(
      player,
      "dynamite",
    ) as number;

    if (willExplose) {
      // 1. Explosion: take damage and discard
      const dynamiteCard = this.playerCtrl.removeEquipmentCard(
        dynamiteCardIndex,
        player,
      );
      this.cardCtrl.discardCard(dynamiteCard);

      player.takeDamage(3);
      if (player.isEliminated) this.handlePlayerEliminated(player);
    } else {
      // 2. Saved: pass the dynamite card to the next active player
      const dynamiteCard = this.playerCtrl.removeEquipmentCard(
        dynamiteCardIndex,
        player,
      );
      const nextPlayer = this.player.getNextPlayerFrom(player);
      this.player.addCardToEquipment(nextPlayer, dynamiteCard);
    }
  }

  private doJailCheck(player: Player) {
    if (!this.player.hasEquipmentCard(player, "jail")) {
      throw new Error(`doJailCheck was called but player doesn't have jail`);
    }

    const drawnCard = this.cardCtrl.drawCards(1)[0];
    const drawnCardMeta = this.cardCtrl.getCardMeta(
      drawnCard,
      "deck",
    ) as PlayingCardMeta;

    const suit = drawnCardMeta.rankAndSuit.suit;

    return suit === "hearts";
  }

  private equipWeapon(player: Player, weaponCardId: string) {
    // Call PlayerController and store returned values to fill new game events
    const {
      unequippedWeaponId,
      unequippedIndex,
      newWeaponIndex,
      newWeaponRange,
    } = this.playerCtrl.equipWeapon(player, weaponCardId);

    // If the old weapon was unequipped - finish discarding it and emit unequip event
    if (unequippedWeaponId !== undefined && unequippedIndex !== undefined) {
      this.discardCard(unequippedWeaponId);

      this.EventSystem.card.unequipped({
        playerId: player.id,
        cardId: unequippedWeaponId,
        cardIndex: unequippedIndex,
        isWeapon: true,
      });
    }

    // Emit new equip event
    this.EventSystem.card.equipped({
      playerId: player.id,
      cardId: weaponCardId,
      cardIndex: newWeaponIndex,
      isWeapon: true,
      range: newWeaponRange,
    });
  }

  private equipCard(player: Player, cardId: string) {
    // Call PlayerController and store returned values to fill new game events
    const { unequippedCardId, unequippedCardIndex, newCardIndex } =
      this.playerCtrl.equipCard(player, cardId);

    // If the old weapon was unequipped - finish discarding it and emit unequip event
    if (unequippedCardId !== undefined && unequippedCardIndex !== undefined) {
      this.discardCard(unequippedCardId);

      this.EventSystem.card.unequipped({
        playerId: player.id,
        cardId: unequippedCardId,
        cardIndex: unequippedCardIndex,
        isWeapon: false,
      });
    }

    // Emit new equip event
    this.EventSystem.card.equipped({
      playerId: player.id,
      cardId: cardId,
      cardIndex: newCardIndex,
      isWeapon: false,
    });
  }
}
