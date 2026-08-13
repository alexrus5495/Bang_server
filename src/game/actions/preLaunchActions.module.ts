import { EventSystem } from "../../eventSystem/eventSystem.js";
import { Role } from "../../types.js";
import { Runtime } from "../engine/runtime/runtime.js";
import { promiseKeys, timerKeys } from "../engine/runtime/runtimeKeys.js";
import { GameStateController } from "../engine/state/gameStateController.js";
import { CardActions } from "./cardActions.module.js";

export class PreLaunchActions {
  constructor(
    private stateCtrl: GameStateController,
    private cardActions: CardActions,
    private runtime: Runtime,
    private eventSystem: EventSystem,
    private onPlayersAssigned?: () => void,
  ) {}

  public async prepareMatch(): Promise<void> {
    this.eventSystem.preLaunch.initializationStarted();
    await this.assignPlayers();

    this.onPlayersAssigned?.();

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
    this.dealRoleCards();
    this.dealCharCards();
    await this.waitForCharSelection();
    this.dealPlayingCards();
  }

  public dealRoleCards(): void {
    console.log("DEALING ROLE CARDS");

    this.stateCtrl.playerCtrl.doForEachPlayer((player, index) => {
      const roleCardId = this.stateCtrl.cardCtrl.drawCards(
        1,
        "roleDeck",
      )[0] as Role;

      if (!roleCardId) {
        throw new Error("Error when getting role card from the deck.");
      }

      this.stateCtrl.assignmentService.assignRole(player, roleCardId);
      this.stateCtrl.assignmentService.savePlayerByRole(player, roleCardId);

      if (roleCardId === "sheriff") {
        this.stateCtrl.playerCtrl.setCurrentPlayer(index);
      }
    });
  }

  public dealCharCards(): void {
    console.log("DEALING CHAR CARDS");

    const PROMISE_NAME = promiseKeys.charSelection;
    this.runtime.setRuntimePromise(PROMISE_NAME);

    // 1. Register phase start event
    this.eventSystem.preLaunch.charSelectionStarted();

    // 2. Generate options for each player
    const allPlayerOptions: {
      playerId: string;
      options: { id: string; bullets: number }[];
    }[] = [];

    this.stateCtrl.playerCtrl.doForEachPlayer((player) => {
      if (!player.id) {
        console.error("Failed to generate options: player missing ID");
        return;
      }

      const options = this.stateCtrl.cardCtrl.createCharOptionsSet();
      allPlayerOptions.push({ playerId: player.id, options });
    });

    // 3. Save to pendingInteraction
    this.stateCtrl.interactionCtrl.charSelection.start(allPlayerOptions);

    // 4. Send the events and launch auto-resolve timers
    allPlayerOptions.forEach(({ playerId, options }, index) => {
      this.eventSystem.preLaunch.charCardsDealt(playerId, options);

      const TIMER_NAME = timerKeys.charSelection.replace("{index}", `${index}`);
      const TIMER_LENGTH_MS = 60000;

      this.runtime.prepareTimer(TIMER_NAME, {
        data: { userSelected: undefined },
      });

      const TIMER_HANDLER = () => {
        console.log(`AUTOSELECT TIMER TRIGGERED FOR PLAYER ${playerId}`);
        const timer = this.runtime.getRuntimeTimer(TIMER_NAME);
        const selectedIndex = timer?.data?.userSelected ?? 0;

        this.stateCtrl.assignmentService.assignChar(playerId, selectedIndex);
      };

      this.runtime.setBroadcastedRuntimeTimer(
        TIMER_NAME,
        TIMER_HANDLER,
        TIMER_LENGTH_MS,
        playerId,
      );
    });
  }

  public dealPlayingCards(): void {
    this.eventSystem.preLaunch.dealingCards();

    this.stateCtrl.playerCtrl.doForEachPlayer((player) => {
      const cardsToDeal = this.stateCtrl.playerCtrl.getMaxHealth(player);
      this.cardActions.drawToHand(player, cardsToDeal);
    });

    this.eventSystem.preLaunch.cardsDealt();
  }
}
