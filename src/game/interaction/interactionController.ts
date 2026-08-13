import { Runtime } from "../engine/runtime/runtime.js";
import { GameState } from "../engine/state/gameState.js";

export type PendingInteraction = GeneralStoreInteraction | CharSelection | null;

export type CharSelection = {
  type: "CHAR_SELECTION";
  options: { playerId: string; options: { id: string; bullets: number }[] }[];
};

export type GeneralStoreInteraction = {
  type: "GENERAL_STORE";
  cards: (string | null)[];
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

  get pending() {
    return this.state.pendingInteraction;
  }

  public setPending(v: Exclude<PendingInteraction, null>) {
    this.state.pendingInteraction = v;
  }

  public resetPending() {
    this.state.pendingInteraction = null;
  }

  //--- CHAR SELECTION API ---
  public get charSelection() {
    return {
      start: (
        options: {
          playerId: string;
          options: { id: string; bullets: number }[];
        }[],
      ) => {
        this.setPending({
          type: "CHAR_SELECTION",
          options,
        });
      },
    };
  }

  // --- GENERAL STORE API ---
  public get store() {
    return {
      start: (cards: string[], pickersOrder: string[]) => {
        this.setPending({
          type: "GENERAL_STORE",
          cards: [...cards],
          pickersOrder,
          currentPickerIndex: 0,
        });
      },

      pickCardByIndex: (cardIndex: number): string => {
        const pending = this.pending;
        if (!pending || pending.type !== "GENERAL_STORE") {
          throw new Error("General Store interaction is not active");
        }

        const cardId = pending.cards[cardIndex];

        if (!cardId) {
          throw new Error(
            `Card at index ${cardIndex} is already picked or invalid`,
          );
        }

        pending.cards[cardIndex] = null;
        pending.currentPickerIndex++;

        return cardId;
      },
    };
  }

  // --- DUEL API ---
  public get duel() {
    return {};
  }

  // --- INDIANS API ---
  public get indians() {
    return {};
  }
}
