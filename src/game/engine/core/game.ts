import { Runtime } from "../runtime/runtime.js";
import { GameState } from "../state/gameState.js";
import { GameStateValidator } from "../state/gameStateValidator.js";
import { GameFlow } from "./gameFlow.js";
import { GameStateController } from "../state/gameStateController.js";
import { MatchPreparer } from "./matchPreparer.js";
import { InteractionController } from "../interactionController.js";
import { PromiseManager } from "../runtime/promiseManager.js";
import { TimerManager } from "../runtime/timerManager.js";
import { PhaseContoller } from "./phaseContoller.js";
import { CardEffectsDispatcher } from "../cards/cardEffectsDispatcher.js";
import type { Player } from "../player/player.js";

export class Game {
  runtime: Runtime;
  state: GameState;
  SC: GameStateController;
  validator: GameStateValidator;
  IC: InteractionController;
  flow: GameFlow;

  public constructor(gameState: GameState) {
    this.runtime = new Runtime(new PromiseManager(), new TimerManager());
    this.state = gameState;
    this.validator = new GameStateValidator(this.state);
    this.SC = new GameStateController(
      this.state,
      this.validator,
      this.runtime,
      this.handlePlayerEliminated,
    );
    this.IC = new InteractionController(this.SC); //WARNING: Don't forget about this one!
    this.flow = new GameFlow(
      new MatchPreparer(this.SC, this.runtime),
      new PhaseContoller(this.SC, this.validator),
      new CardEffectsDispatcher(this.SC, this.validator, this),
    );
  }

  handlePlayerEliminated(eliminatedPlayer: Player, killer?: Player) {
    const winner = this.validator.isGameWon();

    //End game if possible
    if (winner) {
      this.flow.phase.gameOver(winner);
      return;
    }

    if (killer) {
      //Check fines and rewards
      if (this.validator.isPenaltyForSheriff(eliminatedPlayer, killer))
        this.SC.player.applyPenaltyForSheriff(killer);

      if (this.validator.isRewardForOutlaw(eliminatedPlayer))
        this.SC.player.applyRewardForOutlaw(killer);
    }
  }
}
