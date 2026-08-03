import { EventSystem } from "../../eventSystem/eventSystem.js";
import { Runtime } from "../engine/runtime/runtime.js";
import { promiseKeys } from "../engine/runtime/runtimeKeys.js";
import { PlayerActions } from "./playerActions.module.js";

export class PreLaunchActions {
  constructor(
    private playerActions: PlayerActions,
    private runtime: Runtime,
    private eventSystem: EventSystem,
  ) {}

  public async prepareMatch(): Promise<void> {
    this.eventSystem.preLaunch.initializationStarted();
    await this.assignPlayers();
    await this.dealAllCards();
    this.eventSystem.preLaunch.initializationCompleted();
  }

  private async assignPlayers(): Promise<void> {
    this.runtime.setRuntimePromise(
      promiseKeys.allPlayersAssigned,
      60000,
      false,
    );

    const allPlayersAssigned = this.runtime.getRuntimePromise(
      promiseKeys.allPlayersAssigned,
    );

    const successful = await allPlayersAssigned.promise;
    if (!successful) {
      throw new Error("Players failed to connect in time");
    }
  }

  private async waitForCharSelection(): Promise<void> {
    await this.runtime.getRuntimePromise(promiseKeys.charSelection).promise;
  }

  private async dealAllCards(): Promise<void> {
    this.playerActions.dealRoleCards();
    this.playerActions.dealCharCards();
    await this.waitForCharSelection();
    this.playerActions.dealPlayingCards();
  }
}
