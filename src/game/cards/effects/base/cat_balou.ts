import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";
import { promiseKeys } from "../../../engine/runtime/runtimeKeys.js";

export async function CAT_BALOU(
  game: Game,
  player: Player,
  targetPlayer: Player,
  cardId: string,
) {
  console.log(
    `${player.nickname} plays [CAT BALOU] agains ${targetPlayer.nickname}`,
  );

  //1. Create a promise
  const PROMISE_NAME = promiseKeys.cat_balou;
  const PROMISE_TIMEOUT_MS = 10000;
  const PROMISE_AUTORESOLVE_VALUE = true;

  game.runtime.setRuntimePromise(
    PROMISE_NAME,
    PROMISE_TIMEOUT_MS,
    PROMISE_AUTORESOLVE_VALUE,
  );

  //2. Wait for result
  const catPromise = game.runtime.getRuntimePromise(PROMISE_NAME);
  const playerHasChosen = await catPromise.promise;

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
    game.SC.player.pickCatBalouCard(
      player,
      targetPlayer,
      cardIndex,
      pickFrom as "hand" | "equipment",
      false,
    );
  }
}
