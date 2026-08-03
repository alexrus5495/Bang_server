import { EventSystem } from "../../eventSystem/eventSystem.js";
import { Role } from "../../types.js";
import { GameFlow } from "../engine/core/gameFlow.js";
import { Player } from "../engine/player/player.js";
import { Runtime } from "../engine/runtime/runtime.js";
import { promiseKeys, timerKeys } from "../engine/runtime/runtimeKeys.js";
import { GameStateController } from "../engine/state/gameStateController.js";
import { GameStateValidator } from "../engine/state/gameStateValidator.js";
import { CardActions } from "./cardActions.module.js";

export class PlayerActions {
  constructor(
    private stateCtrl: GameStateController,
    private validator: GameStateValidator,
    private cardActions: CardActions,
    private runtime: Runtime,
    private eventSystem: EventSystem,
    private gameFlow: GameFlow,
  ) {}

  //
  //
  //
  // Pre-launch actions
  //
  //
  //
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

      if (roleCardId === "sheriff")
        this.stateCtrl.playerCtrl.setCurrentPlayer(index);
    });
  }

  public dealCharCards(): void {
    console.log("DEALING CHAR CARDS");

    const PROMISE_NAME = promiseKeys.charSelection;
    this.runtime.setRuntimePromise(PROMISE_NAME);

    this.stateCtrl.playerCtrl.doForEachPlayer((player, index) => {
      const options = this.stateCtrl.cardCtrl.createCharOptionsSet();
      this.stateCtrl.assignmentService.setCharOptions(player, options);

      if (player.isAI) {
        this.stateCtrl.assignmentService.assignChar(player, 0);
        return;
      }

      if (!player.id) {
        console.error("Failed to create timer: player don't have an ID");
        return;
      }

      const TIMER_NAME = timerKeys.charSelection.replace("{index}", `${index}`);
      const TIMER_LENGTH_MS = 60000;

      this.runtime.prepareTimer(TIMER_NAME, {
        data: { userSelected: undefined },
      });

      const TIMER_HANDLER = () => {
        console.log("AUTOSELECT TIMER TRIGGERED");
        const timer = this.runtime.getRuntimeTimer(TIMER_NAME);
        const selectedIndex = timer?.data?.userSelected ?? 0;

        this.stateCtrl.assignmentService.assignChar(player, selectedIndex);
      };

      this.runtime.setBroadcastedRuntimeTimer(
        TIMER_NAME,
        TIMER_HANDLER,
        TIMER_LENGTH_MS,
        player.id,
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

  //
  //
  //
  // In-match game rules
  //
  //
  //
  public applyPenaltyForSheriff(player: Player): void {
    const hand = this.stateCtrl.playerCtrl.removeWholeHand(player);
    hand.forEach((card) => this.stateCtrl.cardCtrl.discardCard(card));

    const equipment = this.stateCtrl.playerCtrl.removeAllEquipment(player);
    equipment.forEach((card) => this.stateCtrl.cardCtrl.discardCard(card));
  }

  public applyRewardForOutlaw(player: Player): void {
    this.cardActions.drawToHand(player, 3);
  }

  public handlePlayerEliminated(
    eliminatedPlayer: Player,
    killer?: Player,
  ): void {
    const winner = this.validator.isGameWon();

    // Завершаем игру, если есть победитель
    if (winner) {
      this.gameFlow.gameOver(winner);
      return;
    }

    if (killer) {
      // Проверяем штрафы и награды
      if (this.validator.isPenaltyForSheriff(eliminatedPlayer, killer)) {
        this.applyPenaltyForSheriff(killer);
      }

      if (this.validator.isRewardForOutlaw(eliminatedPlayer)) {
        this.applyRewardForOutlaw(killer);
      }
    }
  }
}
