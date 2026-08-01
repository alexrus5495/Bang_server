import type { GameState } from "../state/gameState.js";
import type { Player } from "../player/player.js";
import type { CardValidationData, Role } from "../../../types.js";
import { log } from "console";

export class GameStateValidator {
  private state: GameState;
  constructor(state: GameState) {
    this.state = state;
  }
  get isAllPlayersAssigned() {
    let isAllPlayersAssigned = true;

    for (let i = 0; i <= this.state.players.length - 1; i++) {
      const player = this.state.players[i];

      if (!player.flags.isPlayerAssigned) isAllPlayersAssigned = false;
    }

    return isAllPlayersAssigned;
  }

  get isAllRolesAssigned() {
    let isAllRolesAssigned = true;

    for (let i = 0; i <= this.state.players.length - 1; i++) {
      const player = this.state.players[i];

      if (!player.flags.isRoleReady) isAllRolesAssigned = false;
    }

    return isAllRolesAssigned;
  }

  get isAllCharsAssigned() {
    let isAllCharsAssigned = true;

    for (let i = 0; i <= this.state.players.length - 1; i++) {
      const player = this.state.players[i];

      if (!player.flags.isCharReady) isAllCharsAssigned = false;
    }

    return isAllCharsAssigned;
  }

  get playersActive() {
    let result = 0;

    this.state.players.forEach((player) => {
      if (!player.flags.isEliminated) result++;
    });

    return result;
  }

  get isDeckEmpty() {
    return this.state.deck.length < 1;
  }

  canEndDiscardingPhase(player: Player) {
    const handSizeLimit = player.stats.health.current;
    const currentHandSize = player.hand.length;

    return currentHandSize <= handSizeLimit;
  }

  validateHand(player: Player) {
    return player.hand.map((card, index) =>
      this.validateForEveryOpponent(card, index, player),
    );
  }

  validateForEveryOpponent(
    cardId: string,
    index: number,
    player: Player,
  ): CardValidationData {
    const targets = this.state.players.filter((p) => p.id !== player.id);
    const cardTargetType = this.state.deckMeta[cardId].effect.target;

    const validationData: CardValidationData = {
      cardId,
      canPlay: false,
      target: cardTargetType,
      possibleTargets: [],
    };

    switch (cardTargetType) {
      case "self":
      case "all":
        const result = this.isCardAllowedToPlay(index, player);
        validationData.canPlay = result;
        break;
      case "many":
      case "one":
        for (let t of targets) {
          const result = this.isCardAllowedToPlay(index, player, t);

          if (result) {
            if (!validationData.canPlay) validationData.canPlay = true;
            validationData.possibleTargets?.push(t.id);
          }
        }
        break;
    }

    return validationData;
  }

  isCardAllowedToPlay(
    cardIndex: number,
    player: Player,
    targetPlayer?: Player,
  ) {
    let cardId = player.hand[cardIndex];

    if (targetPlayer && targetPlayer.flags.isEliminated) return false;

    //BUG: surely not working how intended, look into later
    if (player.char === "calamity_janet")
      cardId = this.tryCalamityJanetCardSwap(cardId, player);

    const satisfiesRange = this.isRangeSatisfied(cardId, player, targetPlayer);
    const satisfiesCondition = this.isConditionSatisfied(
      cardId,
      player,
      targetPlayer,
    );

    return satisfiesRange && satisfiesCondition;
  }

  tryCalamityJanetCardSwap(initialCardId: string, player: Player) {
    let cardId = initialCardId;

    //Calamity Janet can interchange BANG and MISSED cards, so we treat one as
    //another depending on condition:
    if (player.char === "calamity_janet") {
      if (player.flags.isUnderSight && cardId === "bang") cardId = "missed";
      if (!player.flags.isUnderSight && cardId === "missed") cardId = "bang";
    }

    return cardId;
  }

  private isRangeSatisfied(
    cardId: string,
    player: Player,
    targetPlayer?: Player,
  ) {
    const { target, range } = this.state.deckMeta[cardId].effect;

    if (target === "self" || target === "all") {
      return true;
    }

    // Range: "inherit" | "none" | number
    // "Inherit" = weapon range
    // "Number" = got its own range
    // "None" = no range
    //
    // If "inherit" - get weapon range, in other case continue.
    const cardRange = range === "inherit" ? player.weapon.range : range;

    // Now range could only be a number or "none"
    if (typeof cardRange !== "number") {
      return true;
    }

    switch (target) {
      case "one": {
        if (!targetPlayer) {
          let result = false;
          this.state.players.forEach((playerToCheck) => {
            if (playerToCheck !== player && !playerToCheck.flags.isEliminated) {
              const distance = this.getDistance(player, playerToCheck);
              if (cardRange <= distance) result = true;
            }
          });
          return result;
        } else {
          const distance = this.getDistance(player, targetPlayer);
          return distance <= cardRange;
        }
      }
      case "many": {
        let result = false;
        this.state.players.forEach((playerToCheck) => {
          if (playerToCheck !== player && !playerToCheck.flags.isEliminated) {
            const distance = this.getDistance(player, playerToCheck);
            if (cardRange <= distance) result = true;
          }
        });
        return result;
      }
      default: {
        throw new Error("Unexpected card range");
      }
    }
  }

  getDistance(player: Player, targetPlayer: Player) {
    const currentIndex = this.state.players.indexOf(player);

    let indexToCheck = currentIndex;
    let playerToCheck;

    //Check clockwise
    let distanceA = 0;
    do {
      indexToCheck = indexToCheck + 1;

      if (indexToCheck > this.state.players.length - 1) indexToCheck = 0;

      playerToCheck = this.state.players[indexToCheck];

      if (!playerToCheck.flags.isEliminated) distanceA++;

      if (distanceA >= this.state.players.length)
        throw new Error("Target player not found");
    } while (playerToCheck.id !== targetPlayer.id);

    //Check counter-clockwise
    let distanceB = 0;
    indexToCheck = currentIndex;

    do {
      indexToCheck = indexToCheck - 1;

      if (indexToCheck < 0) indexToCheck = this.state.players.length - 1;

      playerToCheck = this.state.players[indexToCheck];

      if (!playerToCheck.flags.isEliminated) distanceB++;

      if (distanceB >= this.state.players.length)
        throw new Error("Target player not found");
    } while (playerToCheck.id !== targetPlayer.id);

    //Find the shortest distance
    let distance = Math.min(distanceA, distanceB);

    //Apply modificators
    if (player.hasEquipmentCard("scope")) distance--;
    if (targetPlayer && targetPlayer.hasEquipmentCard("mustang")) distance++;

    return distance;
  }

  private isConditionSatisfied(
    cardId: string,
    player: Player,
    targetPlayer?: Player,
  ) {
    //Block players who are not current OR not under sight.
    if (
      this.state.players.indexOf(player) !== this.state.currentPlayer &&
      !player.flags.isUnderSight
    ) {
      return false;
    }

    //Block any card other than "bang" for players under duel
    if (player.flags.isLimitedToBang) return cardId === "bang";

    //Block any card other than "missed" for players under sight.
    if (player.flags.isUnderSight) return cardId === "missed";

    //Check other special conditions for certain cards.
    switch (cardId.split("_")[0]) {
      case "bang": {
        return player.stats.bangCardsPlayed < player.stats.bangCardsPlayedLimit;
      }
      case "missed": {
        //Since current player can't be under sight, this check is sufficient.
        return player.flags.isUnderSight;
      }
      case "jail": {
        if (targetPlayer) {
          return targetPlayer.role !== "sheriff";
        } else {
          let result = false;
          this.state.players.forEach((playerToCheck) => {
            if (playerToCheck !== player && playerToCheck.role !== "sheriff") {
              result = true;
            }
          });
          return result;
        }
      }
      default:
        return true;
    }
  }

  public isGameWon() {
    const isSheriffDead = this.isGroupEliminated("sheriff");
    const areOutlawsDead = this.isGroupEliminated("outlaw");
    const isRenegadeDead = this.isGroupEliminated("renegade");
    const areDeputiesDead = this.isGroupEliminated("deputy");

    //Check if renegade won
    if (isSheriffDead && areOutlawsDead && areDeputiesDead) {
      return "renegade";
    }

    //Check if outlaws won
    if (isSheriffDead && !areOutlawsDead) {
      return "outlaws";
    }

    //Check if sheriff won
    if (!isSheriffDead && areOutlawsDead && isRenegadeDead) {
      return "sheriff";
    }

    return false;
  }

  isGroupEliminated(role: Role) {
    const group = this.state.getPlayersByRole(role);

    group.forEach((player) => {
      if (!player.flags.isEliminated) {
        return false;
      }
    });

    return true;
  }

  isPenaltyForSheriff(eliminatedPlayer: Player, killer: Player) {
    const killerIsSheriff = killer.role === "sheriff";
    const killedIsDeputy = eliminatedPlayer.role === "deputy";

    return killerIsSheriff && killedIsDeputy;
  }

  isRewardForOutlaw(eliminatedPlayer: Player) {
    return eliminatedPlayer.role === "outlaw";
  }

  getHealingAmount(player: Player) {
    //NOTE: JUST A PLUG. Special rules will go here.

    let amount;
    if (player.char) {
      amount = 1;
    }

    return amount;
  }
}
