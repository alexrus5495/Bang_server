import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";
import { promiseKeys } from "../../../engine/runtime/runtimeKeys.js";

export async function PANIC(
  game: Game,
  player: Player,
  targetPlayer: Player,
  cardId: string,
) {
  console.log(
    `${player.nickname} plays [PANIC] against ${targetPlayer.nickname}`,
  );

  //1. Create a promise
  const PROMISE_NAME = promiseKeys.panic;
  const PROMISE_TIMEOUT_MS = 10000;
  const PROMISE_AUTORESOLVE_VALUE = false;

  game.runtime.setRuntimePromise(
    PROMISE_NAME,
    PROMISE_TIMEOUT_MS,
    PROMISE_AUTORESOLVE_VALUE,
  );

  //2. Wait for result
  const panicPromise = game.runtime.getRuntimePromise(PROMISE_NAME);
  const playerHasChosen = await panicPromise.promise;

  //3. If player failed to choose, make a random pick
  if (!playerHasChosen) {
    const isTargetHandEmpty = targetPlayer.hand.length === 0;
    const isTargetEquipmentEmpty = targetPlayer.equipment.length === 0;

    if (isTargetEquipmentEmpty && isTargetHandEmpty) {
      console.log("Nothing to choose from");
      return;
    }

    //Choose where to pick from
    let pickFrom;
    if (!isTargetHandEmpty && !isTargetEquipmentEmpty) {
      pickFrom = Math.floor(Math.random() * 2) === 1 ? "hand" : "equipment";
    } else {
      pickFrom = isTargetEquipmentEmpty ? "hand" : "equipment";
    }

    //Choose a card to pick
    let cardIndex;
    if (pickFrom === "equipment") {
      cardIndex = Math.floor(Math.random() * targetPlayer.equipment.length);
    } else {
      cardIndex = Math.floor(Math.random() * targetPlayer.hand.length);
    }

    //Pick a card
    game.StateController.player.pickPanicCard(
      player,
      targetPlayer,
      cardIndex,
      pickFrom as "hand" | "equipment",
      false,
    );
  }
}
