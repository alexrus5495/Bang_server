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

  //
  //
  //
  //  Legacy methods (to-rewrite)
  //
  //
  //
  public pickFromGeneralStore(player: Player, cardId: string): void {
    this.stateCtrl.playerCtrl.addCardsToTheHand(player, [cardId]);

    const playerIndex = this.stateCtrl.playerCtrl.getPlayersIndex(player);
    const PROMISE_NAME = promiseKeys.general_store.replace(
      "{index}",
      `${playerIndex}`,
    );
    this.runtime.cleanupRuntimeTimer(PROMISE_NAME);
    this.runtime.resolveRuntimePromise(PROMISE_NAME, true);
  }

  public pickPanicCard(
    player: Player,
    targetPlayer: Player,
    cardIndex: number,
    pickFrom: "hand" | "equipment",
    resolved?: boolean,
  ): void {
    const card =
      pickFrom === "hand"
        ? this.stateCtrl.playerCtrl.removeCardFromHand(cardIndex, targetPlayer)
        : this.stateCtrl.playerCtrl.removeEquipmentCard(
            cardIndex,
            targetPlayer,
          );

    this.stateCtrl.playerCtrl.addCardsToTheHand(player, [card]);

    if (resolved) return;
    const PROMISE_NAME = promiseKeys.panic;
    this.runtime.resolveRuntimePromise(PROMISE_NAME, true);
  }

  public pickCatBalouCard(
    targetPlayer: Player,
    cardIndex: number,
    pickFrom: "hand" | "equipment",
    resolved?: boolean,
  ): void {
    const card =
      pickFrom === "hand"
        ? this.stateCtrl.playerCtrl.removeCardFromHand(cardIndex, targetPlayer)
        : this.stateCtrl.playerCtrl.removeEquipmentCard(
            cardIndex,
            targetPlayer,
          );

    this.cardActions.discardCard(card);

    if (resolved) return;

    const PROMISE_NAME = promiseKeys.cat_balou;
    this.runtime.resolveRuntimePromise(PROMISE_NAME, true);
  }
}
