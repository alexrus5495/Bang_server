import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";
import { promiseKeys } from "../../../engine/runtime/runtimeKeys.js";

export const GENERAL_STORE: EffectHandler = async ({
  cardId,
  player,
  game,
}) => {
  console.log(`${player.nickname} plays [GENERAL STORE]`);

  //1. Get active players.
  const activePlayers = game.StateController.player.getActivePlayers();

  //2. Rotate array, so the current player is on top.
  const relativeIndex = activePlayers.indexOf(player);
  const queue = [
    ...activePlayers.slice(relativeIndex),
    ...activePlayers.slice(0, relativeIndex),
  ];

  //3. Draw cards based on queue length.
  const cardPool = game.StateController.cards.drawCards(queue.length);

  //4. Each player picks a card consecutively.
  for (const pickingPlayer of queue) {
    console.log(`${pickingPlayer.nickname} choosing card from the store...`);

    //1. Create a promise.
    const absoluteIndex =
      game.StateController.player.getPlayersIndex(pickingPlayer);
    const PROMISE_NAME = promiseKeys.general_store.replace(
      "{index}",
      `${absoluteIndex}`,
    );
    game.runtime.setRuntimePromise(PROMISE_NAME);

    //2. Create a timer to autoreslve with randomly picked card.
    const randomIndex = Math.floor(Math.random() * queue.length);
    const randomCard = cardPool.splice(randomIndex, 1)[0];

    const TIMER_LENGTH_MS = 10000;
    game.runtime.setRuntimeTimer(
      PROMISE_NAME,
      () =>
        game.StateController.player.pickFromGeneralStore(
          pickingPlayer,
          randomCard,
        ),
      TIMER_LENGTH_MS,
    );

    //3. Await for promise resolve
    const promise = game.runtime.getRuntimePromise(PROMISE_NAME);
    await promise.promise;
  }
  console.log(`Shopping is over!`);
};
