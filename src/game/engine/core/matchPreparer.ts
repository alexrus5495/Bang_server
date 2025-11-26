import type { GameStateController } from "../state/gameStateController.js";
import type { Runtime } from "../runtime/runtime.js";
import { promiseKeys } from "../runtime/runtimeKeys.js";

export class MatchPreparer {
  StateController: GameStateController;
  runtime: Runtime;

  constructor(stateController: GameStateController, runtime: Runtime) {
    this.StateController = stateController;
    this.runtime = runtime;
  }

  async prepare() {
    await this.assingPlayers();
    console.log("ALL PLAYERS ASSIGNED");
    await this.dealAllCards();
    console.log("GAME PREPARED");
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
    console.log("DEALING CARDS");

    this.StateController.deal.roleCards();
    this.StateController.deal.charCards();
    await this.waitForCharSelection();
    console.log("ALL CHARS ASSIGNED");

    this.StateController.deal.playingCards();
    console.log("PLAYING CARDS DEALT");
  }
}
