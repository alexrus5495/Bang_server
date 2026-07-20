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
import { PlayersPublicData, PublicData } from "../../../types.js";
import { EventSystem } from "../../../eventSystem/eventSystem.js";

export class Game {
  id: string;
  runtime: Runtime;
  state: GameState;
  StateController: GameStateController;
  validator: GameStateValidator;
  IC: InteractionController;
  CEF: CardEffectsDispatcher;
  flow: GameFlow;
  EventSystem: EventSystem;

  public constructor(
    id: string,
    gameState: GameState,
    eventSystem: EventSystem,
  ) {
    this.id = id;
    this.runtime = new Runtime(new PromiseManager(), new TimerManager());
    this.state = gameState;
    this.validator = new GameStateValidator(this.state);
    this.EventSystem = eventSystem;
    this.StateController = new GameStateController(
      this.id,
      this.state,
      this.validator,
      this.EventSystem,
      this.runtime,
      this.handlePlayerEliminated,
    );
    this.IC = new InteractionController(this.StateController); //WARNING: Don't forget about this one!
    this.CEF = new CardEffectsDispatcher(
      this.StateController,
      this.validator,
      this.EventSystem,
      this,
    );
    this.flow = new GameFlow(
      new MatchPreparer(this.StateController, this.runtime, this.EventSystem),
      new PhaseContoller(
        this.StateController,
        this.validator,
        this.EventSystem,
      ),
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

  get publicData(): PublicData {
    const playersPublicData: PlayersPublicData = [];

    for (const player of this.state.players) {
      playersPublicData.push(player.publicData);
    }

    return {
      id: this.id,
      deckTotalSize: this.state.totalCardsInGame,
      deckCurrentSize: this.state._deck.deck.length,
      discardCurrentSize: this.state.discardPile.length,
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
