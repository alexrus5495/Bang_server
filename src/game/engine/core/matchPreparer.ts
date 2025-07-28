import type { GameStateController } from "../state/gameStateController.js";
import type { Runtime } from "../runtime/runtime.js";
import { promiseKeys } from "../runtime/runtimeKeys.js";

export class MatchPreparer {
  SC: GameStateController;
  runtime: Runtime;

  constructor(stateController: GameStateController, runtime: Runtime) {
    this.SC = stateController;
    this.runtime = runtime;
  }

  async prepare() {
    await this.assingPlayers();
    await this.dealAllCards();
  }

  async assingPlayers() {
    this.runtime.setRuntimePromise(
      promiseKeys.allPlayersAssigned,
      60000,
      false,
    );

    const allPlayersAssignedSuccessfully = this.runtime.getRuntimePromise(
      promiseKeys.allPlayersAssigned,
    );

    if (!allPlayersAssignedSuccessfully)
      throw new Error("Players failed to connect in time");
  }

  private async waitForCharSelection() {
    await this.runtime.getRuntimePromise(promiseKeys.charSelection).promise;
  }

  async dealAllCards() {
    this.SC.deal.roleCards();
    this.SC.deal.charCards();
    await this.waitForCharSelection();
    this.SC.deal.playingCards();
  }
}
