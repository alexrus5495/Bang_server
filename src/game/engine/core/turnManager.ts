import { EventSystem } from "../../../eventSystem/eventSystem.js";
import { GameActions } from "../../actions/gameActions.js";
import { Player } from "../player/player.js";
import { GameStateController } from "../state/gameStateController.js";
import { GameStateValidator } from "../state/gameStateValidator.js";

export class TurnManager {
  private actions!: GameActions;

  constructor(
    private stateCtrl: GameStateController,
    private validator: GameStateValidator,
    private eventSystem: EventSystem,
  ) {}

  public setActions(actions: GameActions): void {
    this.actions = actions;
  }

  /**
   * Entry point to the current player's turn
   */
  public startTurn(playerIndex: number): void {
    const player = this.stateCtrl.playerCtrl.getPlayer(playerIndex);
    this.eventSystem.flow.turnStart(player.id);

    // 1. Check for dynamite
    if (this.stateCtrl.playerCtrl.hasEquipmentCard(player, "dynamite")) {
      this.actions.card.doDynamiteCheck(player);

      // If dynamite exploded and killed current player
      if (player.flags.isEliminated) {
        this.actions.player.handlePlayerEliminated(player);
        this.passTurn();
        return;
      }
    }

    // 2. Check for jail
    if (this.stateCtrl.playerCtrl.hasEquipmentCard(player, "jail")) {
      const jailCardIndex = this.stateCtrl.playerCtrl.getEquipmentCardIndex(
        player,
        "jail",
      );

      if (jailCardIndex !== undefined) {
        this.actions.card.discardEquipment(jailCardIndex, player);
      }

      const isJailCheckSuccessful = this.actions.card.doJailCheck(player);

      // If check failed - pass the turn
      if (!isJailCheckSuccessful) {
        this.passTurn();
        return;
      }
    }

    // 3. Start main turn phases
    this.initiateDrawingPhase(player);
  }

  // --- PHASE 1: DRAWING CARDS ---
  private initiateDrawingPhase(player: Player): void {
    this.eventSystem.flow.drawingStart(player.id);

    // TODO: Учесть свойства персонажей (Black Jack, Kit Carlson и т.д.)
    const cardsToDraw = 2;
    this.actions.card.drawToHand(player, cardsToDraw);

    console.log(`Player (${player.nickname}) has drawn ${cardsToDraw} cards.`);

    this.endDrawingPhase(player);
  }

  private endDrawingPhase(player: Player): void {
    this.eventSystem.flow.drawingEnd(player.id);
    this.initiatePlayingPhase(player);
  }

  // --- PHASE 2: PLAYING CARDS ---
  private initiatePlayingPhase(player: Player): void {
    this.eventSystem.flow.playingStart(player.id);
    this.stateCtrl.playerCtrl.resetBangCounter(player);
  }

  public endPlayingPhase(player: Player): void {
    this.eventSystem.flow.playingEnd(player.id);
    this.initiateDiscardingPhase(player);
  }

  // --- PHASE 3: DISCARDING CARDS ---
  private initiateDiscardingPhase(player: Player): void {
    this.eventSystem.flow.discardingStart(player.id);
  }

  public endDiscardingPhase(player: Player): void {
    if (!this.validator.canEndDiscardingPhase(player)) {
      console.log("Player must discard extra cards before ending turn");
      return;
    }

    this.eventSystem.flow.discardingEnd(player.id);
    this.endPlayersTurn(player);
  }

  // --- ENDING TURN AND PASSING TO THE NEXT PLAYER ---
  private endPlayersTurn(player: Player): void {
    this.eventSystem.flow.turnEnd(player.id);
    this.passTurn();
  }

  public passTurn(): void {
    console.log("Passing turn...");

    const currentIndex = this.stateCtrl.playerCtrl.currentPlayer;
    const nextPlayerIndex =
      this.stateCtrl.playerCtrl.getNewCurrentPlayer(currentIndex);

    this.stateCtrl.playerCtrl.setCurrentPlayer(nextPlayerIndex);

    const nextPlayer = this.stateCtrl.playerCtrl.getPlayer(nextPlayerIndex);
    console.log(
      `New current player: Player ${nextPlayerIndex} (${nextPlayer.nickname})`,
    );

    this.startTurn(nextPlayerIndex);
  }
}
