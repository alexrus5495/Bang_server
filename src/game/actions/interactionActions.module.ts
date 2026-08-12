import { EventSystem } from "../../eventSystem/eventSystem.js";
import { Player } from "../engine/player/player.js";
import { Runtime } from "../engine/runtime/runtime.js";
import { promiseKeys, timerKeys } from "../engine/runtime/runtimeKeys.js";
import { GameStateController } from "../engine/state/gameStateController.js";
import { CardActions } from "./cardActions.module.js";

export class InteractionActions {
  constructor(
    private stateCtrl: GameStateController,
    private cardActions: CardActions,
    private runtime: Runtime,
    private eventSystem: EventSystem,
  ) {}

  public onPlayerPickChar(player: Player, option: 0 | 1): void {
    if (player.char !== "") return;

    const playerIndex = this.stateCtrl.playerCtrl.getPlayersIndex(player);
    const TIMER_NAME = timerKeys.charSelection.replace(
      "{index}",
      `${playerIndex}`,
    );
    this.runtime.cleanupBroadcastedRuntimeTimer(TIMER_NAME);

    this.stateCtrl.assignmentService.assignChar(player, option);
  }

  public pickStoreCard(playerId: string, cardIndex: number): void {
    console.log(`called pick action`);
    const pending = this.stateCtrl.interactionCtrl.pending;

    if (!pending || pending.type !== "GENERAL_STORE") {
      throw new Error("No active General Store");
    }

    const currentPickerId = pending.pickersOrder[pending.currentPickerIndex];
    console.log(`currentPickerId is ${currentPickerId}`);

    if (playerId !== currentPickerId) {
      throw new Error("It's not your turn to pick a card");
    }

    const pickedCardId =
      this.stateCtrl.interactionCtrl.store.pickCardByIndex(cardIndex);

    const player = this.stateCtrl.playerCtrl.getPlayerById(playerId);
    if (!player) return;
    this.stateCtrl.playerCtrl.addCardsToHand(player, [pickedCardId]);

    this.eventSystem.store.cardPicked(playerId, pickedCardId, cardIndex);

    const promiseName = promiseKeys.general_store.replace("{index}", playerId);
    if (this.runtime.getRuntimePromise(promiseName)) {
      this.runtime.resolveRuntimePromise(promiseName, true);
    }
  }
}
