import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";
import { promiseKeys } from "../../../engine/runtime/runtimeKeys.js";

export const GENERAL_STORE: EffectHandler = async ({
  cardId,
  player,
  game,
}) => {
  console.log(`${player.nickname} plays [GENERAL STORE]`);

  // 1. Get ordered array of active players
  const activePlayers =
    game.StateController.player.getActivePlayersStartingFrom(player);

  // 2. Draw N cards to fill the store
  const storeCards = game.StateController.cards.drawCards(activePlayers.length);

  // 3. Update current interaction inside game state
  game.state.pendingInteraction;

  // 1. Create STORE_INITIATED event and send in to clients
  game.EventSystem.store.initiated(
    storeCards,
    activePlayers.map((p) => p.id),
  );

  // 2. Consecutively wait for every player's choice
  for (let i = 0; i < activePlayers.length; i++) {
    const currentPicker = activePlayers[i];
    const isLast = i === activePlayers.length - 1;

    if (isLast) {
    }
  }

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
