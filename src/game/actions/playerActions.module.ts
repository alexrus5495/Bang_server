import { EventSystem } from "../../eventSystem/eventSystem.js";
import { GameFlow } from "../engine/core/gameFlow.js";
import { Player } from "../engine/player/player.js";
import { Runtime } from "../engine/runtime/runtime.js";
import { GameStateController } from "../engine/state/gameStateController.js";
import { GameStateValidator } from "../engine/state/gameStateValidator.js";
import { CardActions } from "./cardActions.module.js";

export class PlayerActions {
  constructor(
    private stateCtrl: GameStateController,
    private validator: GameStateValidator,
    private cardActions: CardActions,
    private runtime: Runtime,
    private eventSystem: EventSystem,
    private gameFlow: GameFlow,
  ) {}

  //
  // In-match game rules
  //
  public applyPenaltyForSheriff(player: Player): void {
    const hand = this.stateCtrl.playerCtrl.removeWholeHand(player);
    hand.forEach((card) => this.stateCtrl.cardCtrl.discardCard(card));

    const equipment = this.stateCtrl.playerCtrl.removeAllEquipment(player);
    equipment.forEach((card) => this.stateCtrl.cardCtrl.discardCard(card));
  }

  public applyRewardForOutlaw(player: Player): void {
    this.cardActions.drawToHand(player, 3);
  }

  public handlePlayerEliminated(
    eliminatedPlayer: Player,
    killer?: Player,
  ): void {
    const winner = this.validator.isGameWon();

    if (winner) {
      this.gameFlow.gameOver(winner);
      return;
    }

    if (killer) {
      if (this.validator.isPenaltyForSheriff(eliminatedPlayer, killer)) {
        this.applyPenaltyForSheriff(killer);
      }

      if (this.validator.isRewardForOutlaw(eliminatedPlayer)) {
        this.applyRewardForOutlaw(killer);
      }
    }
  }
}
