import { log } from "console";
import { MessageSystem } from "../../../messageSystem/messageSystem.js";
import type { Player } from "../player/player.js";
import type { GameStateController } from "../state/gameStateController.js";
import type { GameStateValidator } from "../state/gameStateValidator.js";

export class PhaseContoller {
  private StateController: GameStateController;
  private validator: GameStateValidator;
  private MessageSystem: MessageSystem;

  constructor(
    stateController: GameStateController,
    validator: GameStateValidator,
    messageSystem: MessageSystem,
  ) {
    this.StateController = stateController;
    this.validator = validator;
    this.MessageSystem = messageSystem;
  }

  startGame() {
    this.MessageSystem.gameStarted();
    this.initiatePlayersTurn(this.StateController.player.getCurrentPlayer());
  }

  private initiatePlayersTurn(currentPlayer: number) {
    const player = this.StateController.player.getPlayer(currentPlayer);
    this.MessageSystem.playerTurnStart(player);

    //Check for dynamite
    const doesHaveDynamite = this.StateController.player.hasEquipmentCard(
      player,
      "dynamite",
    );

    if (doesHaveDynamite) {
      this.StateController.player.doDynamiteCheck(player);
      if (player.flags.isEliminated) {
        this.passTurn();
        return;
      }
    }

    //Check for jail
    const doesHaveJail = this.StateController.player.hasEquipmentCard(
      player,
      "jail",
    );
    if (doesHaveJail) {
      const jailCardIndex = this.StateController.player.getEquipmentCardIndex(
        player,
        "jail",
      ) as number;
      this.StateController.cards.discardEquipment(jailCardIndex, player);

      const isJailCheckSuccessful =
        this.StateController.player.doJailCheck(player);
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

    this.StateController.cards.drawToHand(player, cardsToDraw);

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
    this.StateController.player.resetBangCounter(player);

    //TESTING: going straight to discarding cards
    console.log("SKIPPING PLAYING PHASE");
    this.endPlayingPhase(player);
  }

  endPlayingPhase(player: Player) {
    console.log("End of playing phase");

    this.initiateDiscardingPhase(player);
  }

  initiateDiscardingPhase(player: Player) {
    console.log("PHASE 3 - DISCARDING CARDS");

    //TESTING: discarding cards blidly to end the turn
    if (player.isAI) {
      console.log("DISCARDING BLINDLY");
      console.log(`Health: ${player.stats.health}`);
      console.log(`Cards in hand: ${player.hand.length}`);

      while (!this.validator.canEndDiscardingPhase(player)) {
        console.log("Discarding");
        this.StateController.cards.discardFromHand(0, player);
        console.log(`Now cards in hand: ${player.hand.length}`);
      }

      console.log("ENDING TURN");
      this.endDiscardingPhase(player);
    }
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

    const newPlayerIndex = this.StateController.player.getNewCurrentPlayer(
      this.StateController.player.getCurrentPlayer(),
    );

    this.StateController.player.setCurrentPlayer(newPlayerIndex);

    console.log(
      `New current player: Player ${newPlayerIndex}(${this.StateController.player.getPlayer(newPlayerIndex).nickname})`,
    );

    this.initiatePlayersTurn(newPlayerIndex);
  }

  gameOver(winner: string) {
    console.log(`GAME OVER. ${winner} won!`);
  }
}
