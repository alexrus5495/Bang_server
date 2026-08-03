import { Runtime } from "../engine/runtime/runtime.js";
import { GameState } from "../engine/state/gameState.js";

export type PendingInteraction = GeneralStoreInteraction | null;

export type GeneralStoreInteraction = {
  type: "GENERAL_STORE";
  cards: string[];
  pickersOrder: string[]; // Ordered array of playerId's
  currentPickerIndex: number;
};

export class InteractionController {
  private state: GameState;
  private runtime: Runtime;
  constructor(state: GameState, runtime: Runtime) {
    this.state = state;
    this.runtime = runtime;
  }
}
