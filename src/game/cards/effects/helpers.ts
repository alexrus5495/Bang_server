import { Game } from "../../engine/core/game.js";
import { Player } from "../../engine/player/player.js";

export function equipWeaponEffect(
  game: Game,
  player: Player,
  cardId: string,
  expectedPrefix: string,
) {
  if (!cardId.startsWith(expectedPrefix)) {
    throw new Error(
      `Unexpected cardId "${cardId}". Expected prefix "${expectedPrefix}"`,
    );
  }

  game.StateController.player.equipWeapon(player, cardId);
}

export function equipCardEffect(
  game: Game,
  player: Player,
  cardId: string,
  expectedPrefix: string,
) {
  if (!cardId.startsWith(expectedPrefix)) {
    throw new Error(
      `Unexpected cardId "${cardId}". Expected prefix "${expectedPrefix}"`,
    );
  }

  game.StateController.player.equipCard(player, cardId);
}
