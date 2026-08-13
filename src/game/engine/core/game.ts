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
import { AiController } from "../ai/AiController.js";

export class Game {
  public readonly id: string;
  public readonly runtime: Runtime;
  private state: GameState;
  public stateCtrl: GameStateController;
  public actions: GameActions;
  public validator: GameStateValidator;
  public cardsDispatcher: CardEffectsDispatcher;
  public flow: GameFlow;
  public eventSystem: EventSystem;
  public turnMngr: TurnManager;
  private aiCtrl: AiController | null = null;

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
      () => this.initAiCtrl(),
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

  public initAiCtrl() {
    this.aiCtrl = new AiController(this);
  }

  public destroyAiCtrl() {
    this.aiCtrl?.destroy();
    this.aiCtrl = null;
  }
}
