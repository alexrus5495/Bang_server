import { EventSystem } from "../../../eventSystem/eventSystem.js";
import type { Player } from "../player/player.js";
import type { GameStateController } from "../state/gameStateController.js";
import type { GameStateValidator } from "../state/gameStateValidator.js";

export class PhaseContoller {
  private StateController: GameStateController;
  private validator: GameStateValidator;
  private EventSystem: EventSystem;

  constructor(
    stateController: GameStateController,
    validator: GameStateValidator,
    eventSystem: EventSystem,
  ) {
    this.StateController = stateController;
    this.validator = validator;
    this.EventSystem = eventSystem;
  }

  startGame() {
    this.EventSystem.preLaunch.gameStarted();
    this.initiatePlayersTurn(this.StateController.player.getCurrentPlayer());
  }

  private initiatePlayersTurn(currentPlayer: number) {
    const player = this.StateController.player.getPlayer(currentPlayer);
    this.EventSystem.flow.turnStart(player.id);

    //WARNING: REFACTOR
    //
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
    this.EventSystem.flow.drawingStart(player.id);

    //TODO: add exceptions for some chars.
    const cardsToDraw = 2;

    this.StateController.cards.drawToHand(player, cardsToDraw);

    console.log(`Player (${player.nickname}) has drawn ${cardsToDraw} cards.`);
    console.log(`Cards in hand now: ${player.hand.length}`);

    this.endDrawingPhase(player);
  }

  endDrawingPhase(player: Player) {
    this.EventSystem.flow.drawingEnd(player.id);
    this.initiatePlayingPhase(player);
  }

  initiatePlayingPhase(player: Player) {
    this.EventSystem.flow.playingStart(player.id);
    this.StateController.player.resetBangCounter(player);

    //TESTING: going straight to discarding cards
    if (player.isAI) {
      console.log("SKIPPING PLAYING PHASE");
      this.endPlayingPhase(player);
    }
  }

  endPlayingPhase(player: Player) {
    this.EventSystem.flow.playingEnd(player.id);
    this.initiateDiscardingPhase(player);
  }

  initiateDiscardingPhase(player: Player) {
    this.EventSystem.flow.discardingStart(player.id);

    //TESTING: discarding cards blidly to end the turn
    if (player.isAI) {
      console.log("DISCARDING BLINDLY");
      console.log(`Health: ${player.stats.health}`);
      console.log(`Cards in hand: ${player.hand.length}`);

      while (!this.validator.canEndDiscardingPhase(player)) {
        console.log("Discarding");
        const discardedCard = player.hand[0];
        this.StateController.cards.discardFromHand(0, player);
        this.EventSystem.card.discarded(player.id, discardedCard, 0);
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
      this.EventSystem.flow.discardingEnd(player.id);

      this.endPlayersTurn(player);
    }
  }

  endPlayersTurn(player: Player) {
    this.EventSystem.flow.turnEnd(player.id);
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
