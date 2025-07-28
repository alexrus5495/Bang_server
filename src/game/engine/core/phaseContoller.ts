import type { Player } from "../player/player.js";
import type { GameStateController } from "../state/gameStateController.js";
import type { GameStateValidator } from "../state/gameStateValidator.js";

export class PhaseContoller {
  private SC: GameStateController;
  private validator: GameStateValidator;

  constructor(
    stateController: GameStateController,
    validator: GameStateValidator,
  ) {
    this.SC = stateController;
    this.validator = validator;
  }

  startGame() {
    console.log("Game has started!");
    this.initiatePlayersTurn(this.SC.player.getCurrentPlayer());
  }

  private initiatePlayersTurn(currentPlayer: number) {
    const player = this.SC.player.getPlayer(currentPlayer);
    console.log(`Player (${player.nickname}) turn has started!`);

    //Check for dynamite
    const doesHaveDynamite = this.SC.player._doesHaveEquipmentCard(
      player,
      "dynamite",
    );

    if (doesHaveDynamite) {
      this.SC.player.doDynamiteCheck(player);
      if (player.flags.isEliminated) {
        this.passTurn();
        return;
      }
    }

    //Check for jail
    const doesHaveJail = this.SC.player._doesHaveEquipmentCard(player, "jail");
    if (doesHaveJail) {
      const jailCardIndex = this.SC.player._findEquipmentCardIndex(
        player,
        "jail",
      ) as number;
      this.SC.cards.discardEquipment(jailCardIndex, player);

      const isJailCheckSuccessful = this.SC.player.doJailCheck(player);
      if (!isJailCheckSuccessful) {
        this.passTurn();
        return;
      }
    }

    this.initiateDrawingPhase(player);
  }

  private initiateDrawingPhase(player: Player) {
    console.log("PHASE 1 - DRAWING CARDS.");

    //TODO: add exceptions for some chars.
    const cardsToDraw = 2;

    this.SC.cards.drawToHand(player, cardsToDraw);

    console.log(`Player (${player.nickname}) has drawn ${cardsToDraw} cards.`);
    console.log(`Cards in hand now: ${player.hand.length}`);

    this.endDrawingPhase(player);
  }

  endDrawingPhase(player: Player) {
    console.log("End of drawing phase");

    this.initiatePlayingPhase(player);
  }

  initiatePlayingPhase(player: Player) {
    console.log("PHASE 2 - PLAYING CARDS");
    this.SC.player.resetBangCounter(player);
  }

  endPlayingPhase(player: Player) {
    console.log("End of playing phase");

    this.initiateDiscardingPhase(player);
  }

  initiateDiscardingPhase(player: Player) {
    console.log("PHASE 3 - DISCARDING CARDS");
  }

  endDiscardingPhase(player: Player) {
    if (!this.validator.canEndDiscardingPhase(player)) {
      console.log("Player must discard extra cards before ending turn");
    } else {
      console.log("End of discarding phase");

      this.endPlayersTurn(player);
    }
  }

  endPlayersTurn(player: Player) {
    console.log(`End of Player (${player.nickname}) turn`);

    this.passTurn();
  }

  passTurn() {
    console.log(`Passing turn...`);

    const newPlayerIndex = this.SC.player.getNewCurrentPlayer(
      this.SC.player.getCurrentPlayer(),
    );

    this.SC.player.setCurrentPlayer(newPlayerIndex);

    console.log(
      `New current player: Player ${newPlayerIndex}(${this.SC.player.getPlayer(newPlayerIndex).nickname})`,
    );

    this.initiatePlayersTurn(newPlayerIndex);
  }

  gameOver(winner: string) {
    console.log(`GAME OVER. ${winner} won!`);
  }
}
