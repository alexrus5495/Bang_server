import { Player } from "../game/engine/player/player.js";
import { io } from "../server.js";
import { SocketEvents } from "../socket-events.js";
import {
  Message,
  MessageTemplate,
  PlayerMessage,
  SystemMessage,
} from "./types.js";

type PendingBroadcast = {
  timeout: NodeJS.Timeout;
  startedAt: number;
};

const DEBOUNCE_MS = 25;
const MAX_WAIT_MS = 100;

export class MessageSystem {
  private lobbyId: string;
  private messages: Message[] = [];
  private pendingBroadcast: PendingBroadcast | null;

  constructor(gameId: string) {
    this.lobbyId = gameId;
    this.messages = [];
    this.pendingBroadcast = null;
  }

  broadcastMessages() {
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

    this.pendingBroadcast = {
      timeout,
      startedAt: now,
    };
  }

  async flushBroadcast() {
    const pending = this.pendingBroadcast;

    if (pending) {
      clearTimeout(pending.timeout);
      this.pendingBroadcast = null;
    }

    const clientsInRoom = await io.in(this.lobbyId).fetchSockets();
    clientsInRoom.forEach((client) => {
      client.emit(
        SocketEvents.BROADCAST_MESSAGES,
        this.filterInvisibleMessages(client.id),
      );
    });
  }

  filterInvisibleMessages(clientId: string) {
    const filteredMessages: Message[] = [];

    for (const message of this.messages) {
      switch (message.type) {
        case "player":
          filteredMessages.push(message);
          break;

        case "system":
          const data = message.data;
          if (
            !data ||
            !("visibleTo" in data) ||
            data.visibleTo.includes(clientId)
          ) {
            filteredMessages.push(message);
          } else {
            if ("cardId" in data) {
              const filteredMessage: Message = {
                ...message,
                data: {
                  ...data,
                  card: {
                    ...data.card,
                    cardId: "",
                  },
                },
              };
              filteredMessages.push(filteredMessage);
            } else {
              filteredMessages.push(message);
            }
          }
          break;
      }
    }

    return filteredMessages;
  }

  createSystemMessage<K extends keyof MessageTemplate>(
    template: K,
    data: MessageTemplate[K],
  ) {
    const message: SystemMessage = {
      id: this.messages.length,
      type: "system",
      template,
      data,
      timestamp: new Date(),
    };

    this.messages.push(message);
    this.broadcastMessages();
  }

  createPlayerMessage(author: string, content: string) {
    const message: PlayerMessage = {
      id: this.messages.length,
      type: "player",
      author,
      content,
      timestamp: new Date(),
    };

    this.messages.push(message);
    this.broadcastMessages();
  }

  gameStarted() {
    this.createSystemMessage("game_started", null);
  }

  playerTurnStart(player: Player) {
    this.createSystemMessage("player_turn_start", {
      player: {
        tag: "player",
        isAI: player.isAI as boolean,
        nickname: player.nickname,
        id: player.id as string,
      },
    });
  }

  playerCardDrawn(player: Player, cardId: string, cardIndex: number) {
    this.createSystemMessage("player_card_drawn", {
      player: {
        tag: "player",
        isAI: player.isAI as boolean,
        nickname: player.nickname,
        id: player.id as string,
      },
      card: {
        id: cardId,
        index: cardIndex,
      },
      visibleTo: [player.id as string],
    });
  }
}
