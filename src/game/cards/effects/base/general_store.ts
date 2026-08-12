import { createAckKey } from "../../../../lib/ackUtils.js";
import { EffectHandler } from "../../../engine/cards/cardEffectsRegistry.js";
import { promiseKeys, timerKeys } from "../../../engine/runtime/runtimeKeys.js";

export const GENERAL_STORE: EffectHandler = async ({ player, game }) => {
  console.log(`${player.nickname} plays [GENERAL STORE]`);

  // 1. Get ordered array of active players starting from current player
  const activePlayers =
    game.stateCtrl.playerCtrl.getActivePlayersStartingFrom(player);

  const activePlayersIds = activePlayers.map((p) => p.id);

  // 2. Create and broadcast store initiation game event
  game.eventSystem.store.initiated([...activePlayersIds]);

  // 3. Draw N cards to fill the store
  const storeCards: string[] = [];

  for (let i = 0; i < activePlayers.length; i++) {
    const [drawnCardId] = game.stateCtrl.cardCtrl.drawCards(1);
    storeCards.push(drawnCardId);

    game.eventSystem.store.cardAdded(drawnCardId, i);
  }

  // 4. Update current interaction inside game state
  game.stateCtrl.interactionCtrl.store.start([...storeCards], activePlayersIds);
  game.eventSystem.store.ready();

  // 5. Consecutively wait for every player's choice
  for (let i = 0; i < activePlayers.length; i++) {
    const currentPicker = activePlayers[i];

    // Emit game event for next picker
    game.eventSystem.store.nextPicker(currentPicker.id);

    const isLast = i === activePlayers.length - 1;

    const pending = game.stateCtrl.interactionCtrl.pending;
    if (!pending || pending.type !== "GENERAL_STORE")
      throw new Error(`Pending interaction is not GENERAL_STORE`);

    // --- LAST PLAYER ---
    if (isLast) {
      const remainingIndex = pending.cards.findIndex((card) => card !== null);

      if (remainingIndex !== -1) {
        game.actions.interaction.pickStoreCard(
          currentPicker.id,
          remainingIndex,
        );
      }
      break;
    }

    // --- REGULAR PLAYER WITH BROADCASTED TIMER ---
    if (!currentPicker.isAI) {
      // Wait for client ack before starting the timer
      const ackKey = createAckKey("STORE_NEXT_PICKER", currentPicker.id);
      await game.runtime.waitForClientAck(ackKey);

      // Guard close in case state changed while client played animations
      const pendingAfterAck = game.stateCtrl.interactionCtrl.pending;
      if (!pendingAfterAck || pendingAfterAck.type !== "GENERAL_STORE") break;
    }

    const PROMISE_NAME = promiseKeys.general_store.replace(
      "{index}",
      currentPicker.id,
    );
    const TIMER_NAME = timerKeys.general_store.replace(
      "{index}",
      currentPicker.id,
    );

    const TIMER_LENGTH_MS = 10000;

    // 1. Prepare runtime promise
    game.runtime.setRuntimePromise(PROMISE_NAME);

    // 2. Prepare auto-resolve timer
    game.runtime.prepareTimer(TIMER_NAME, {});

    // 3. Timeout handler: autopick a random card if player didn't pick in time
    const TIMER_HANDLER = () => {
      console.log(`AUTOSELECT TIMER TRIGGERED FOR ${currentPicker.nickname}`);

      const currentPending = game.stateCtrl.interactionCtrl.pending;

      if (currentPending && currentPending.type === "GENERAL_STORE") {
        const availableIndices = currentPending.cards
          .map((card, idx) => (card !== null ? idx : null))
          .filter((idx): idx is number => idx !== null);

        if (availableIndices.length > 0) {
          const randomIndex =
            availableIndices[
              Math.floor(Math.random() * availableIndices.length)
            ];

          console.log(
            `Autopicking card index ${randomIndex} for ${currentPicker.id}`,
          );
          game.actions.interaction.pickStoreCard(currentPicker.id, randomIndex);
        }
      }

      game.runtime.resolveRuntimePromise(PROMISE_NAME, false);
    };
    // 4. Start broadcasted timer for all room members using game.id
    game.runtime.setBroadcastedRuntimeTimer(
      TIMER_NAME,
      TIMER_HANDLER,
      TIMER_LENGTH_MS,
      game.id,
    );

    // 5. Wait for player action (manual click) OR timeout execution
    const promiseWrapper = game.runtime.getRuntimePromise(PROMISE_NAME);
    const isPickedByPlayer = await promiseWrapper?.promise;

    // 6. If player picked manually in time, cancel the active broadcast timer
    if (isPickedByPlayer) {
      console.log(`Player ${currentPicker.id} picked manually in time`);
      game.runtime.cleanupBroadcastedRuntimeTimer(TIMER_NAME);
    }
  }

  // 6. Complete interaction & notify clients
  console.log(`All players handled successfully, resetting pending state`);
  game.stateCtrl.interactionCtrl.resetPending();
  console.log(`Closing store`);
  game.eventSystem.store.closed();
  game.eventSystem.card.tableCleared();

  console.log(`[GENERAL STORE] completed successfully.`);
};
