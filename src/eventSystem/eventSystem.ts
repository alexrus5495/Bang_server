import { io } from "../server.js";
import { SocketEvents } from "../socket-events.js";
import { EventType, GameEvent } from "./types.js";
import { PreLaunchEvents } from "./PreLaunchEvents.js";
import { PlayerEvents } from "./PlayerEvents.js";
import { FlowEvents } from "./FlowEvents.js";
import { CardEvents } from "./CardEvents.js";

type PendingBroadcast = {
  timeout: NodeJS.Timeout;
  startedAt: number;
};

type ClientCache = {
  lastProcessedId: number;
  events: GameEvent[];
};

const DEBOUNCE_MS = 25;
const MAX_WAIT_MS = 100;

export class EventSystem {
  private lobbyId: string;
  /** Append-only event log. Events are never removed */
  private events: GameEvent[];
  private pendingBroadcast: PendingBroadcast | null;
  private cache: Map<string, ClientCache>;
  readonly preLaunch: PreLaunchEvents;
  readonly player: PlayerEvents;
  readonly flow: FlowEvents;
  readonly card: CardEvents;

  constructor(gameId: string) {
    this.lobbyId = gameId;
    this.events = [];
    this.cache = new Map();
    this.pendingBroadcast = null;
    this.preLaunch = new PreLaunchEvents(this);
    this.player = new PlayerEvents(this);
    this.flow = new FlowEvents(this);
    this.card = new CardEvents(this);
  }

  //
  // ─── Core ───
  //

  register<K extends keyof EventType>(type: K, data: EventType[K]) {
    const message: GameEvent = {
      id: this.events.length,
      type,
      data,
      timestamp: new Date(),
    };
    this.events.push(message);
    this.broadcastEvents();
  }

  private broadcastEvents() {
    const existing = this.pendingBroadcast;
    const now = Date.now();

    if (existing) {
      const elapsed = now - existing.startedAt;
      clearTimeout(existing.timeout);

      const timeout = setTimeout(
        () => this.flushBroadcast(),
        Math.max(0, DEBOUNCE_MS),
      );

      this.pendingBroadcast = {
        timeout,
        startedAt: elapsed >= MAX_WAIT_MS ? now : existing.startedAt,
      };

      if (elapsed >= MAX_WAIT_MS) {
        this.flushBroadcast();
      }

      return;
    }

    const timeout = setTimeout(() => this.flushBroadcast(), DEBOUNCE_MS);
    this.pendingBroadcast = { timeout, startedAt: now };
  }

  private async flushBroadcast() {
    const pending = this.pendingBroadcast;

    if (pending) {
      clearTimeout(pending.timeout);
      this.pendingBroadcast = null;
    }

    const clientsInRoom = await io.in(this.lobbyId).fetchSockets();
    clientsInRoom.forEach((client) => {
      client.emit(
        SocketEvents.BROADCAST_EVENTS,
        this.hideInvisibleData(client.id),
      );
    });
  }

  private hideInvisibleData(clientId: string) {
    //Initialize cache if missing
    if (!this.cache.has(clientId)) {
      this.cache.set(clientId, { events: [], lastProcessedId: 0 });
    }

    const cache = this.cache.get(clientId)!;
    const lastProcessedId = cache.lastProcessedId;

    if (lastProcessedId >= this.events.length) {
      return cache.events;
    }

    const newEvents = this.events.slice(lastProcessedId);
    const newProcessedEvents = newEvents.map((event) =>
      this.processEventVisibility(event, clientId),
    );

    cache.events = [...cache.events, ...newProcessedEvents];
    cache.lastProcessedId = this.events.length;

    return cache.events;
  }

  private processEventVisibility(
    event: GameEvent,
    clientId: string,
  ): GameEvent {
    if (this.isEventVisibleToClient(event, clientId)) {
      return event;
    }

    return this.applyVisibilityMask(event);
  }

  private isEventVisibleToClient(event: GameEvent, clientId: string): boolean {
    const data = event.data;
    return !data || !("visibleTo" in data) || data.visibleTo.includes(clientId);
  }

  private applyVisibilityMask(event: GameEvent): GameEvent {
    if (!event.data) return event;

    const masks = [
      this.maskCardId,
      this.maskRole,

      //New mask functions go here
    ];

    return masks.reduce((maskedEvent, mask) => mask(maskedEvent), event);
  }

  private maskCardId(event: GameEvent): GameEvent {
    const data = event.data;
    if (!data || !("card" in data && "id" in data.card)) {
      return event;
    }

    return {
      ...event,
      data: {
        ...data,
        card: { ...data.card, id: "" },
      },
    };
  }

  private maskRole(event: GameEvent): GameEvent {
    const data = event.data;
    if (!data || !("role" in data) || data.role === "sheriff") {
      return event;
    }

    return {
      ...event,
      data: {
        ...data,
        role: "",
      },
    };
  }
}
