import type { GameStateController } from "./state/gameStateController.js";
import type { Player } from "./player/player.js";

export class InteractionController {
  SC: GameStateController;
  constructor(stateController: GameStateController) {
    this.SC = stateController;
  }
  onPlayerPickChar(player: Player, option: 0 | 1) {
    this.SC.player.setChar(player, option);
  }

  onPlayerGeneralStorePick(player: Player, cardId: string) {
    this.SC.player.pickFromGeneralStore(player, cardId);
  }

  onPlayerPanicPick(
    player: Player,
    targetPlayer: Player,
    cardIndex: number,
    pickFrom: "hand" | "equipment",
  ) {
    this.SC.player.pickPanicCard(player, targetPlayer, cardIndex, pickFrom);
  }

  onPlayerCatBalouPick(
    player: Player,
    targetPlayer: Player,
    cardIndex: number,
    pickFrom: "hand" | "equipment",
  ) {
    this.SC.player.pickCatBalouCard(player, targetPlayer, cardIndex, pickFrom);
  }
}
