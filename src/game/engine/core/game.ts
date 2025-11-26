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
import { MessageSystem } from "../../../messageSystem/messageSystem.js";

export class Game {
  id: string;
  runtime: Runtime;
  state: GameState;
  StateController: GameStateController;
  validator: GameStateValidator;
  IC: InteractionController;
  flow: GameFlow;
  MessageSystem: MessageSystem;

  public constructor(
    id: string,
    gameState: GameState,
    messageSystem: MessageSystem,
  ) {
    this.id = id;
    this.runtime = new Runtime(new PromiseManager(), new TimerManager());
    this.state = gameState;
    this.validator = new GameStateValidator(this.state);
    this.MessageSystem = messageSystem;
    this.StateController = new GameStateController(
      this.id,
      this.state,
      this.validator,
      this.runtime,
      this.handlePlayerEliminated,
    );
    this.IC = new InteractionController(this.StateController); //WARNING: Don't forget about this one!
    this.flow = new GameFlow(
      new MatchPreparer(this.StateController, this.runtime),
      new PhaseContoller(
        this.StateController,
        this.validator,
        this.MessageSystem,
      ),
      new CardEffectsDispatcher(this.StateController, this.validator, this),
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
        this.StateController.player.applyPenaltyForSheriff(killer);

      if (this.validator.isRewardForOutlaw(eliminatedPlayer))
        this.StateController.player.applyRewardForOutlaw(killer);
    }
  }

  get publicData() {
    const playersPublicData = [];

    for (const player of this.state.players) {
      playersPublicData.push(player.publicData);
    }

    return {
      id: this.id,
      deckLength: this.state._deck.deck.length,
      disardPileLength: this.state.discardPile.length,
      currentPlayer: this.state.currentPlayer,
      playersPublicData: playersPublicData,
    };
  }

  get publicCardMeta() {
    return {
      deckMeta: this.state.deckMeta,
      charDeckMeta: this.state.charDeckMeta,
      roleDeckMeta: this.state.roleDeckMeta,
    };
  }
}
