import type { GameStateController } from "../state/gameStateController.js";
import type { Runtime } from "../runtime/runtime.js";
import { promiseKeys } from "../runtime/runtimeKeys.js";
import { EventSystem } from "../../../eventSystem/eventSystem.js";

export class MatchPreparer {
  StateController: GameStateController;
  runtime: Runtime;
  EventSystem: EventSystem;

  constructor(
    stateController: GameStateController,
    runtime: Runtime,
    eventSystem: EventSystem,
  ) {
    this.StateController = stateController;
    this.runtime = runtime;
    this.EventSystem = eventSystem;
  }

  async prepare() {
    this.EventSystem.preLaunch.initializationStarted();
    await this.assingPlayers();
    await this.dealAllCards();
    this.EventSystem.preLaunch.initializationCompleted();
  }

  async assingPlayers() {
    this.runtime.setRuntimePromise(
      promiseKeys.allPlayersAssigned,
      60000,
      false,
    );

    const allPlayersAssigned = this.runtime.getRuntimePromise(
      promiseKeys.allPlayersAssigned,
    );

    const allPlayersAssignedSuccessfully = await allPlayersAssigned.promise;

    if (!allPlayersAssignedSuccessfully)
      throw new Error("Players failed to connect in time");
  }

  private async waitForCharSelection() {
    await this.runtime.getRuntimePromise(promiseKeys.charSelection).promise;
  }

  async dealAllCards() {
    this.StateController.deal.roleCards();
    this.StateController.deal.charCards();
    await this.waitForCharSelection();
    this.StateController.deal.playingCards();
  }
}
