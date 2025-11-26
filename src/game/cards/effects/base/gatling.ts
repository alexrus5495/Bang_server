import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";
import { promiseKeys } from "../../../engine/runtime/runtimeKeys.js";

export async function GATLING(game: Game, player: Player, cardId: string) {
  console.log(`${player.nickname} plays [GATLING!]`);

  game.StateController.player.doAsyncForAllOtherPlayers(
    player,
    async (otherPlayer: Player, index: number) => {
      //1. Flag the player
      otherPlayer.flags.isUnderSight = true;

      //2. Check if player can be saved by a BARREL
      const playerHasBarrel = game.StateController.player.hasEquipmentCard(
        otherPlayer,
        "barrel",
      );

      const barrelCheck = playerHasBarrel
        ? game.StateController.cards.doBarrelCheck()
        : undefined;

      //3. Create a promise.
      const PROMISE_NAME = promiseKeys.gatling.replace("{index}", `${index}`);
      const PROMISE_TIMEOUT_MS = 10000;
      const PROMISE_AUTORESOLVE_VALUE = false;

      game.runtime.setRuntimePromise(
        PROMISE_NAME,
        PROMISE_TIMEOUT_MS,
        PROMISE_AUTORESOLVE_VALUE,
      );
      const gatlingPromise = game.runtime.getRuntimePromise(PROMISE_NAME);

      //4. If player has been saved by a BARREL resolve promise on the spot
      if (barrelCheck?.isPlayerSaved)
        game.runtime.resolveRuntimePromise(PROMISE_NAME, false);

      //5. Get promise result.
      const willTakeDamage = await gatlingPromise.promise;

      //6. Unflag the player.
      otherPlayer.flags.isUnderSight = false;

      //7. Deal damage.
      if (willTakeDamage) otherPlayer.takeDamage(1);

      //8. Handle player elimination.
      if (otherPlayer.flags.isEliminated)
        game.handlePlayerEliminated(otherPlayer, player);
    },
  );
}
