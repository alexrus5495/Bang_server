import type { GameStateController } from "./state/gameStateController.js";
import type { Player } from "./player/player.js";

export class InteractionController {
  StateController: GameStateController;
  constructor(stateController: GameStateController) {
    this.StateController = stateController;
  }
  onPlayerPickChar(player: Player, option: 0 | 1) {
    this.StateController.assignmentService.assignChar(player, option);
  }

  onPlayerGeneralStorePick(player: Player, cardId: string) {
    this.StateController.player.pickFromGeneralStore(player, cardId);
  }

  onPlayerPanicPick(
    player: Player,
    targetPlayer: Player,
    cardIndex: number,
    pickFrom: "hand" | "equipment",
  ) {
    this.StateController.player.pickPanicCard(
      player,
      targetPlayer,
      cardIndex,
      pickFrom,
    );
  }

  onPlayerCatBalouPick(
    targetPlayer: Player,
    cardIndex: number,
    pickFrom: "hand" | "equipment",
  ) {
    this.StateController.player.pickCatBalouCard(
      targetPlayer,
      cardIndex,
      pickFrom,
    );
  }
}
