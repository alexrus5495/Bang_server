import { EventType, GameEvent } from "../../../eventSystem/types.js";
import { AI_HANDLERS } from "../../../server.js";
import { Game } from "../core/game.js";
import { AiBrain } from "./AiBrain.js";
import { AiHandler } from "./handlers/loader.js";

const IGNORED_AI_EVENTS: Set<keyof EventType> = new Set([
  "GAME_CREATED",
  "INITIALIZATION_STARTED",
  "PLAYER_ASSIGNED_SLOT",
  "PLAYER_ASSIGNED_CHAR",
  "PLAYER_ASSIGNED_ROLE",
  "CARD_DRAWN",
  "PLAYERS_SHUFFLED",
  "CHAR_SELECTION_STARTED",
  "CHAR_SELECTION_COMPLETED",
  "DEALING_CARDS",
  "CARDS_DEALT",
  "INITIALIZATION_COMPLETED",
  "GAME_STARTED",
]);

export class AiController {
  private brains: Map<string, AiBrain> = new Map();
  private handlers: Record<string, AiHandler<any>> = {};
  private unsubscribe: (() => void) | null = null;

  constructor(private game: Game) {
    this.handlers = AI_HANDLERS;
    this.initBrains();

    this.unsubscribe = this.game.eventSystem.subscribeAi((event) =>
      this.onGameEvent(event),
    );
  }

  private initBrains() {
    const players = this.game.stateCtrl.playerCtrl.getAllPlayers();
    for (const p of players) {
      if (p.isAI) {
        this.brains.set(p.id, new AiBrain(p.id));
      }
    }
  }

  private onGameEvent(event: GameEvent) {
    if (IGNORED_AI_EVENTS.has(event.type)) return;

    const handler = this.handlers[event.type];

    if (!handler) {
      console.warn(`[AiController] No handler found for: ${event.type}`);
      return;
    }

    const playerId = (event.data as any)?.playerId;
    const brain = playerId ? this.brains.get(playerId) : undefined;

    handler({
      game: this.game,
      data: event.data,
      event,
      brain,
      brains: this.brains,
    });
  }

  public destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.brains.clear();
  }
}
