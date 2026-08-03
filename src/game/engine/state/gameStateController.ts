import { CardController } from "../cards/cardController.js";
import type { GameState } from "./gameState.js";
import type { GameStateValidator } from "./gameStateValidator.js";
import { PlayerController } from "../player/playerController.js";
import type { Runtime } from "../runtime/runtime.js";
import { PlayerAssignmentService } from "../player/playerAssignmentService.js";
import { EventSystem } from "../../../eventSystem/eventSystem.js";
import { InteractionController } from "../../interaction/interactionController.js";

export class GameStateController {
  public readonly playerCtrl: PlayerController;
  public readonly cardCtrl: CardController;
  public readonly interactionCtrl: InteractionController;
  public readonly assignmentService: PlayerAssignmentService;

  constructor(
    id: string,
    state: GameState,
    validator: GameStateValidator,
    eventSystem: EventSystem,
    runtime: Runtime,
  ) {
    this.playerCtrl = new PlayerController(id, state, validator, runtime);
    this.cardCtrl = new CardController(state, validator, runtime);
    this.interactionCtrl = new InteractionController(state, runtime);
    this.assignmentService = new PlayerAssignmentService(
      state,
      validator,
      runtime,
      eventSystem,
    );
  }
}
