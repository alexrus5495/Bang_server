import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";
import { promiseKeys } from "../../../engine/runtime/runtimeKeys.js";

export const MISSED: EffectHandler = ({ game, cardId, player }) => {
  console.log(`${player.nickname} plays [MISSED!]`);

  let availablePromise;

  //1. Find available promise.
  const BANG_PROMISE_NAME = promiseKeys.bang;
  const bangPromise = game.runtime.getRuntimePromise(BANG_PROMISE_NAME).promise;

  const GATLING_PROMISE_NAME = promiseKeys.gatling.replace(
    "{index}",
    `${game.StateController.player.getPlayersIndex(player)}`,
  );

  const gatlingPromise =
    game.runtime.getRuntimePromise(GATLING_PROMISE_NAME).promise;

  if (bangPromise) availablePromise = "bang";
  else if (gatlingPromise) availablePromise = "gatling";

  //2. Handle promise.
  switch (availablePromise) {
    case "bang": {
      const promiseCounters =
        game.runtime.getRuntimePromise(BANG_PROMISE_NAME).counters;

      if (!promiseCounters) {
        game.runtime.resolveRuntimePromise(BANG_PROMISE_NAME, false);
        return;
      }

      promiseCounters.current++;
      if (promiseCounters.current === promiseCounters.needed) {
        game.runtime.resolveRuntimePromise(BANG_PROMISE_NAME, false);
        return;
      }
      break;
    }
    case "gatling": {
      game.runtime.resolveRuntimePromise(GATLING_PROMISE_NAME, false);
      return;
    }
    default:
      return;
  }
};
