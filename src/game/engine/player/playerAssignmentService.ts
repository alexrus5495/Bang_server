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

  constructor(
    state: GameState,
    validator: GameStateValidator,
    runtime: Runtime,
  ) {
    this.state = state;
    this.validator = validator;
    this.runtime = runtime;
  }

  assignToAnEmptySlot(playerData: LobbySeat) {
    for (const player of this.state.players) {
      if (!player.flags.isPlayerAssigned) {
        player.assingPlayer(playerData);
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
  }

  assignRole(player: Player, roleCardId: string) {
    player.assignRole(roleCardId);
  }

  assignChar(player: Player, option: 0 | 1) {
    if (player.char !== "") return;

    player.pickCharCard(option);

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
