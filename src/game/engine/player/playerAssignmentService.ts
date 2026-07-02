import { EventSystem } from "../../../eventSystem/eventSystem.js";
import { LobbySeat, Role } from "../../../types.js";
import { Runtime } from "../runtime/runtime.js";
import { promiseKeys } from "../runtime/runtimeKeys.js";
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

  assignChar(player: Player, option: 0 | 1) {
    if (!player.id || player.char !== "") return;

    player.pickCharCard(option);
    this.eventSystem.player.assignedChar(
      player.id,
      player.charOptions[option].id,
      player.stats.health,
    );

    if (this.validator.isAllCharsAssigned) {
      this.runtime.resolveRuntimePromise(promiseKeys.charSelection, true);
    }
  }

  setCharOptions(player: Player, options: { id: string; bullets: number }[]) {
    player.charOptions = options;
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
