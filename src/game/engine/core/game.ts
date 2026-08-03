import { Runtime } from "../runtime/runtime.js";
import { GameState } from "../state/gameState.js";
import { GameStateValidator } from "../state/gameStateValidator.js";
import { GameFlow } from "./gameFlow.js";
import { GameStateController } from "../state/gameStateController.js";
import { PromiseManager } from "../runtime/promiseManager.js";
import { TimerManager } from "../runtime/timerManager.js";
import { CardEffectsDispatcher } from "../cards/cardEffectsDispatcher.js";
import { EventSystem } from "../../../eventSystem/eventSystem.js";
import { GameActions } from "../../actions/gameActions.js";
import { TurnManager } from "./turnManager.js";

export class Game {
  id: string;
  private runtime: Runtime;
  private state: GameState;
  stateCtrl: GameStateController;
  actions: GameActions;
  validator: GameStateValidator;
  cardsDispatcher: CardEffectsDispatcher;
  flow: GameFlow;
  eventSystem: EventSystem;
  turnMngr: TurnManager;

  public constructor(
    id: string,
    gameState: GameState,
    eventSystem: EventSystem,
  ) {
    this.id = id;
    this.runtime = new Runtime(new PromiseManager(), new TimerManager());
    this.state = gameState;
    this.validator = new GameStateValidator(this.state);
    this.eventSystem = eventSystem;
    this.stateCtrl = new GameStateController(
      this.id,
      this.state,
      this.validator,
      this.eventSystem,
      this.runtime,
    );

    this.turnMngr = new TurnManager(
      this.stateCtrl,
      this.validator,
      this.eventSystem,
    );

    this.flow = new GameFlow(this.stateCtrl, this.turnMngr, this.eventSystem);

    this.actions = new GameActions(
      this.stateCtrl,
      this.validator,
      this.runtime,
      this.eventSystem,
      this.flow,
    );

    this.turnMngr.setActions(this.actions);
    this.flow.setActions(this.actions);

    this.cardsDispatcher = new CardEffectsDispatcher(
      this.stateCtrl,
      this.validator,
      this.eventSystem,
      this,
    );
  }

  get publicCardMeta() {
    return {
      deckMeta: this.state.deckMeta,
      charDeckMeta: this.state.charDeckMeta,
      roleDeckMeta: this.state.roleDeckMeta,
    };
  }
}
