import type { Game } from "../../../engine/core/game.js";
import type { Player } from "../../../engine/player/player.js";
import { promiseKeys } from "../../../engine/runtime/runtimeKeys.js";

export async function BANG(
  game: Game,
  player: Player,
  targetPlayer: Player,
  cardId: string,
) {
  switch (player.flags.isLimitedToBang) {
    case "duel": {
      duelBang(game, player);
      break;
    }
    case "indians": {
      indiansBang(game, player);
      break;
    }
    case false: {
      await regularBang(game, player, targetPlayer);
    }
  }
}

async function regularBang(game: Game, player: Player, targetPlayer: Player) {
  console.log(
    `${player.nickname} plays [BANG!] agains ${targetPlayer.nickname}`,
  );
  //1. Register card as Played.
  player.incrementBangCounter();

  //2. Flag the player.
  targetPlayer.flags.isUnderSight = true;

  //3. Check if player can be saved by a BARREL.
  const playerHasBarrel = game.StateController.player.hasEquipmentCard(
    targetPlayer,
    "barrel",
  );

  const barrelCheck = playerHasBarrel
    ? game.StateController.cards.doBarrelCheck()
    : undefined;

  //4. Set counters for MISSED! cards to resolve a promise.
  const resolveCounters = {
    current: 0,
    needed: player.char === "slab_the_killer" ? 2 : 1,
  };

  //5. Create a promise
  const PROMISE_NAME = promiseKeys.bang;
  const PROMISE_TIMEOUT_MS = 10000;
  const PROMISE_AUTORESOLVE_VALUE = true;

  game.runtime.setRuntimePromise(
    PROMISE_NAME,
    PROMISE_TIMEOUT_MS,
    PROMISE_AUTORESOLVE_VALUE,
    resolveCounters,
  );
  const bangPromise = game.runtime.getRuntimePromise(PROMISE_NAME);

  //6. If player has been saved by a BARREL try to resolve promise on the spot
  if (barrelCheck?.isPlayerSaved && bangPromise.counters) {
    bangPromise.counters.current++;

    if (bangPromise.counters.current === bangPromise.counters.needed) {
      game.runtime.resolveRuntimePromise(promiseKeys.bang, false);
    }
  }

  //7. Get promise result.
  const willTakeDamage = await bangPromise.promise;

  //8. Unflag the player
  targetPlayer.flags.isUnderSight = false;

  //9. Deal damage
  if (willTakeDamage) {
    targetPlayer.takeDamage(1);
  }

  //10. Handle player elimination
  if (targetPlayer.flags.isEliminated)
    game.handlePlayerEliminated(targetPlayer, player);
}

function duelBang(game: Game, player: Player) {
  const playerIndex = game.StateController.player.getPlayersIndex(player);
  const DUEL_PROMISE_NAME = promiseKeys.duel.replace(
    "{index}",
    `${playerIndex}`,
  );
  const duelPromise = game.runtime.getRuntimePromise(DUEL_PROMISE_NAME);

  if (duelPromise) {
    console.log(`${player.nickname} plays [BANG!] in a [DUEL]`);
    game.runtime.resolveRuntimePromise(DUEL_PROMISE_NAME, false);
  } else throw new Error("Expected to find duel promise, but failed");
}

function indiansBang(game: Game, player: Player) {
  const playerIndex = game.StateController.player.getPlayersIndex(player);
  const PROMISE_NAME = promiseKeys.indians.replace("{index}", `${playerIndex}`);
  const indiansPromise = game.runtime.getRuntimePromise(PROMISE_NAME);

  if (indiansPromise) {
    console.log(`${player.nickname} avoids taking damage!`);
    game.runtime.resolveRuntimePromise(PROMISE_NAME, false);
  } else throw new Error("Expected to find indians promise, but failed");
}
