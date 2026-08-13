import { EventType, GameEvent } from "../../../eventSystem/types.js";
import { randomDelay } from "../../../lib/randomDelay.js";
import { Game } from "../core/game.js";
import { AiBrain } from "./AiBrain.js";

export class AiController {
  private brains: Map<string, AiBrain> = new Map();
  private unsubscribe: (() => void) | null = null;

  constructor(private game: Game) {
    // 1. Find every bot and create a brain for each
    this.initBrains();

    // 2. Subscribe to game events
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
    switch (event.type) {
      case "CHAR_CARDS_DEALT":
        this.handleCharCardsDealt(event.data as EventType["CHAR_CARDS_DEALT"]);
        break;
      default:
        break;
    }
  }

  handleCharCardsDealt(data: {
    playerId: string;
    options: { id: string; bullets: number }[];
  }) {
    const brain = this.brains.get(data.playerId);
    if (!brain) return;

    const delay = randomDelay(500, 3000);

    setTimeout(() => {
      const selectedIndex = brain.selectBestCharOption(data.options);

      this.game.actions.interaction.pickChar(brain.playerId, selectedIndex);
    }, delay);
  }

  public destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.brains.clear();
  }
}
