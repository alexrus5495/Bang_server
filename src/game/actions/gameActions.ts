import { EventSystem } from "../../eventSystem/eventSystem.js";
import { GameFlow } from "../engine/core/gameFlow.js";
import { Runtime } from "../engine/runtime/runtime.js";
import { GameStateController } from "../engine/state/gameStateController.js";
import { GameStateValidator } from "../engine/state/gameStateValidator.js";
import { CardActions } from "./cardActions.module.js";
import { InteractionActions } from "./interactionActions.module.js";
import { PlayerActions } from "./playerActions.module.js";
import { PreLaunchActions } from "./preLaunchActions.module.js";

export class GameActions {
  public readonly card: CardActions;
  public readonly player: PlayerActions;
  public readonly interaction: InteractionActions;
  public readonly preLaunch: PreLaunchActions;

  constructor(
    stateCtrl: GameStateController,
    validator: GameStateValidator,
    runtime: Runtime,
    eventSystem: EventSystem,
    gameFlow: GameFlow,
  ) {
    this.card = new CardActions(stateCtrl, runtime, eventSystem);
    this.player = new PlayerActions(
      stateCtrl,
      validator,
      this.card,
      runtime,
      eventSystem,
      gameFlow,
    );
    this.interaction = new InteractionActions(
      stateCtrl,
      this.card,
      runtime,
      eventSystem,
    );
    this.preLaunch = new PreLaunchActions(this.player, runtime, eventSystem);
  }
}
