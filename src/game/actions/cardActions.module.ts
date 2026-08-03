import { EventSystem } from "../../eventSystem/eventSystem.js";
import { getCardRankValue } from "../../lib/getCardRankValue.js";
import { PlayingCardMeta } from "../../types.js";
import { Player } from "../engine/player/player.js";
import { Runtime } from "../engine/runtime/runtime.js";
import { GameStateController } from "../engine/state/gameStateController.js";

export class CardActions {
  constructor(
    private stateCtrl: GameStateController,
    private runtime: Runtime,
    private eventSystem: EventSystem,
  ) {}
  //
  //
  //
  //  Drawing/discarding cards
  //
  //
  //
  public drawToHand(player: Player, cardsToDraw: number): void {
    const cards = this.stateCtrl.cardCtrl.drawCards(cardsToDraw);
    this.stateCtrl.playerCtrl.addCardsToTheHand(player, cards);
    for (const card of cards) {
      const index = player.hand.indexOf(card);
      this.eventSystem.card.drawn(player.id, card, index);
    }
  }

  public discardCard(card: string): void {
    this.stateCtrl.cardCtrl.discardCard(card);
  }

  public discardFromHand(cardIndex: number, player: Player): void {
    const discardedCard = this.stateCtrl.playerCtrl.removeCardFromHand(
      cardIndex,
      player,
    );
    this.stateCtrl.cardCtrl.discardCard(discardedCard);
  }

  public discardEquipment(cardIndex: number, player: Player): void {
    const discardedCard = this.stateCtrl.playerCtrl.removeEquipmentCard(
      cardIndex,
      player,
    );
    this.stateCtrl.cardCtrl.discardCard(discardedCard);
  }

  //
  //
  //
  //  Checks
  //
  //
  //
  public doBarrelCheck(): { card: string; isPlayerSaved: boolean } {
    const card = this.stateCtrl.cardCtrl.drawCards(1)[0];
    const cardMeta = this.stateCtrl.cardCtrl.getCardMeta(
      card,
      "deck",
    ) as PlayingCardMeta;
    const cardSuit = cardMeta.rankAndSuit.suit;

    this.stateCtrl.cardCtrl.discardCard(card);

    return { card, isPlayerSaved: cardSuit === "hearts" };
  }

  public doDynamiteCheck(player: Player): void {
    if (!this.stateCtrl.playerCtrl.hasEquipmentCard(player, "dynamite")) {
      throw new Error(
        `doDynamiteCheck was called but player doesn't have dynamite`,
      );
    }

    const drawnCard = this.stateCtrl.cardCtrl.drawCards(1)[0];
    const drawnCardMeta = this.stateCtrl.cardCtrl.getCardMeta(
      drawnCard,
      "deck",
    ) as PlayingCardMeta;

    const { rank, suit } = drawnCardMeta.rankAndSuit;
    const numericRank = getCardRankValue(rank);

    const willExplode =
      suit === "spades" && numericRank >= 2 && numericRank <= 9;

    const dynamiteCardIndex = this.stateCtrl.playerCtrl.getEquipmentCardIndex(
      player,
      "dynamite",
    ) as number;

    if (willExplode) {
      const dynamiteCard = this.stateCtrl.playerCtrl.removeEquipmentCard(
        dynamiteCardIndex,
        player,
      );
      this.stateCtrl.cardCtrl.discardCard(dynamiteCard);

      player.takeDamage(3);
    } else {
      const dynamiteCard = this.stateCtrl.playerCtrl.removeEquipmentCard(
        dynamiteCardIndex,
        player,
      );

      this.stateCtrl.cardCtrl.discardCard(drawnCard);
      const nextPlayer = this.stateCtrl.playerCtrl.getNextPlayerFrom(player);
      this.stateCtrl.playerCtrl.addCardToEquipment(nextPlayer, dynamiteCard);
    }
  }

  public doJailCheck(player: Player): boolean {
    if (!this.stateCtrl.playerCtrl.hasEquipmentCard(player, "jail")) {
      throw new Error(`doJailCheck was called but player doesn't have jail`);
    }

    const drawnCard = this.stateCtrl.cardCtrl.drawCards(1)[0];
    const drawnCardMeta = this.stateCtrl.cardCtrl.getCardMeta(
      drawnCard,
      "deck",
    ) as PlayingCardMeta;

    this.stateCtrl.cardCtrl.discardCard(drawnCard);
    return drawnCardMeta.rankAndSuit.suit === "hearts";
  }

  //
  //
  //
  //  Equipping/unequipping cards
  //
  //
  //
  public equipWeapon(player: Player, weaponCardId: string): void {
    const {
      unequippedWeaponId,
      unequippedIndex,
      newWeaponIndex,
      newWeaponRange,
    } = this.stateCtrl.playerCtrl.equipWeapon(player, weaponCardId);

    if (unequippedWeaponId !== undefined && unequippedIndex !== undefined) {
      this.discardCard(unequippedWeaponId);

      this.eventSystem.card.unequipped({
        playerId: player.id,
        cardId: unequippedWeaponId,
        cardIndex: unequippedIndex,
        isWeapon: true,
      });
    }

    this.eventSystem.card.equipped({
      playerId: player.id,
      cardId: weaponCardId,
      cardIndex: newWeaponIndex,
      isWeapon: true,
      range: newWeaponRange,
    });
  }

  public equipCard(player: Player, cardId: string): void {
    const { unequippedCardId, unequippedCardIndex, newCardIndex } =
      this.stateCtrl.playerCtrl.equipCard(player, cardId);

    if (unequippedCardId !== undefined && unequippedCardIndex !== undefined) {
      this.discardCard(unequippedCardId);

      this.eventSystem.card.unequipped({
        playerId: player.id,
        cardId: unequippedCardId,
        cardIndex: unequippedCardIndex,
        isWeapon: false,
      });
    }

    this.eventSystem.card.equipped({
      playerId: player.id,
      cardId: cardId,
      cardIndex: newCardIndex,
      isWeapon: false,
    });
  }
}
