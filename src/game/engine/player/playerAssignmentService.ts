import { EventSystem } from "../../../eventSystem/eventSystem.js";
import { LobbySeat, Role } from "../../../types.js";
import { Runtime } from "../runtime/runtime.js";
import { promiseKeys, timerKeys } from "../runtime/runtimeKeys.js";
import { GameState } from "../state/gameState.js";
import { GameStateValidator } from "../state/gameStateValidator.js";
import { Player } from "./player.js";

export class PlayerAssignmentService {
  state: GameState;
  runtime: Runtime;
  validator: GameStateValidator;
  eventSystem: EventSystem;

  constructor(
    state: GameState,
    validator: GameStateValidator,
    runtime: Runtime,
    eventSystem: EventSystem,
  ) {
    this.state = state;
    this.validator = validator;
    this.runtime = runtime;
    this.eventSystem = eventSystem;
  }

  assignToAnEmptySlot(playerData: LobbySeat) {
    for (const player of this.state.players) {
      if (!player.flags.isPlayerAssigned) {
        player.assingPlayer(playerData);

        const index = this.state.players.indexOf(player);
        this.eventSystem.player.assignedSlot(index, player.getAssignedData());
        break;
      }
    }

    if (this.validator.isAllPlayersAssigned) {
      this.shufflePlayers();
      this.runtime.resolveRuntimePromise(promiseKeys.allPlayersAssigned, true);
    }
  }

  shufflePlayers() {
    const result = [...this.state.players];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    this.state.players = result;

    const newOrder = result.map((player) => player.id ?? "");
    this.eventSystem.player.shuffled(newOrder);
  }

  assignRole(player: Player, roleCardId: string) {
    if (!player.id) return;
    player.assignRole(roleCardId);
    this.eventSystem.player.assignedRole(player.id, roleCardId);
  }

  assignChar(playerId: string, optionIndex: number) {
    const pending = this.state.pendingInteraction;
    if (!pending || pending.type !== "CHAR_SELECTION") {
      console.warn(
        `No active CHAR_SELECTION interaction for player ${playerId}`,
      );
      return;
    }

    const player = this.state.players.find((p) => p.id === playerId);
    if (!player || player.flags.isCharReady) {
      return;
    }

    const playerData = pending.options.find(
      (item) => item.playerId === playerId,
    );
    if (!playerData) {
      console.warn(`Char options not found for player ${playerId}`);
      return;
    }

    // Clear the auto-resolve timer
    const playerIndex = this.state.players.indexOf(player);
    const TIMER_NAME = timerKeys.charSelection.replace(
      "{index}",
      `${playerIndex}`,
    );
    this.runtime.cleanupBroadcastedRuntimeTimer(TIMER_NAME);

    // Apply the choice
    const selectedOption =
      playerData.options[optionIndex] ?? playerData.options[0];
    player.assignChar(selectedOption);

    // Notify event system
    this.eventSystem.player.assignedChar(
      player.id!,
      player.char!,
      player.stats.health,
    );

    // Check if all players finished choosing
    const allReady = this.state.players.every((p) => p.flags.isCharReady);

    if (allReady) {
      this.state.pendingInteraction = null;
      this.eventSystem.preLaunch.charSelectionCompleted();

      if (this.runtime.getRuntimePromise(promiseKeys.charSelection)) {
        this.runtime.resolveRuntimePromise(promiseKeys.charSelection, true);
      }
    }
  }

  isPlayerAssigned(id: string) {
    for (const player of this.state.players) {
      if (player.id === id) return true;
    }
    return false;
  }

  savePlayerByRole(player: Player, role: Role) {
    this.state.roles[role].push(player);
  }
}
