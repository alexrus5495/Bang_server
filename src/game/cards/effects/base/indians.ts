import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";
import type { Player } from "../../../engine/player/player.js";
import { promiseKeys } from "../../../engine/runtime/runtimeKeys.js";

export const INDIANS: EffectHandler = async ({ game, player, cardId }) => {
  console.log(`${player.nickname} plays [INDIANS!]`);

  game.StateController.player.doAsyncForAllOtherPlayers(
    player,
    async (otherPlayer: Player) => {
      //1. Flag the player
      otherPlayer.flags.isLimitedToBang = "indians";

      //2. Create a promise
      const absolutePlayerIndex =
        game.StateController.player.getPlayersIndex(otherPlayer);
      const PROMISE_NAME = promiseKeys.indians.replace(
        "{index}",
        `${absolutePlayerIndex}`,
      );
      const PROMISE_TIMEOUT_MS = 10000;
      const PROMISE_AUTORESOLVE_VALUE = true;

      game.runtime.setRuntimePromise(
        PROMISE_NAME,
        PROMISE_TIMEOUT_MS,
        PROMISE_AUTORESOLVE_VALUE,
      );

      const indiansPromise = game.runtime.getRuntimePromise(PROMISE_NAME);

      //3. Get promise result.
      const willTakeDamage = await indiansPromise.promise;

      //4. Deal damage.
      if (willTakeDamage) otherPlayer.takeDamage(1);

      //5. Handle player elimination
      if (otherPlayer.flags.isEliminated)
        game.handlePlayerEliminated(otherPlayer, player);
    },
  );
};
