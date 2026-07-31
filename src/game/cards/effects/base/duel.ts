import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";
import type { Player } from "../../../engine/player/player.js";
import { promiseKeys } from "../../../engine/runtime/runtimeKeys.js";

export const DUEL: EffectHandler = async ({
  cardId,
  player,
  targetPlayer,
  game,
}) => {
  if (!targetPlayer) return;
  let currentDuelist = targetPlayer;
  if (!currentDuelist) return;

  function nextDuelist() {
    // currentDuelist = currentDuelist === targetPlayer ? player : targetPlayer;
  }

  async function tryToWinDuel(duelist: Player) {
    //1. Flag the duelist.
    duelist.flags.isLimitedToBang = "duel";

    //2. Create promise
    const DUELIST_INDEX = game.StateController.player.getPlayersIndex(duelist);
    const PROMISE_NAME = promiseKeys.duel.replace(
      "{index}",
      `${DUELIST_INDEX}`,
    );
    const PROMISE_AUTORESOLVE_VALUE = true;
    const PROMISE_TIMEOUT_MS = 6000;

    game.runtime.setRuntimePromise(
      PROMISE_NAME,
      PROMISE_TIMEOUT_MS,
      PROMISE_AUTORESOLVE_VALUE,
    );
    const duelPromise = game.runtime.getRuntimePromise(PROMISE_NAME);

    //3. Await result
    const isLoser = await duelPromise.promise;

    //4. Unflag the duelist
    duelist.flags.isLimitedToBang = false;

    //5. Handle the result.
    if (isLoser) {
      duelist.takeDamage(1);
    } else {
      nextDuelist();
      await tryToWinDuel(currentDuelist);
    }
  }

  console.log(
    `${player.nickname} plays [DUEL] against ${targetPlayer.nickname}`,
  );
  await tryToWinDuel(currentDuelist);
};
