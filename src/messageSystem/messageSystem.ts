import { Player } from "../game/engine/player/player.js";
import { io } from "../server.js";
import { SocketEvents } from "../socket-events.js";
import {
  Message,
  MessageTemplate,
  PlayerMessage,
  SystemMessage,
} from "./types.js";

export class MessageSystem {
  private lobbyId: string;
  private messages: Message[] = [];

  constructor(gameId: string) {
    this.lobbyId = gameId;
    this.messages = [];
  }

  async broadcastMessages() {
    const clientsInRoom = await io.in(this.lobbyId).fetchSockets();

    clientsInRoom.forEach((client) => {
      client.emit(SocketEvents.BROADCAST_MESSAGES, this.messages);
    });
  }

  createSystemMessage<K extends keyof MessageTemplate>(
    template: K,
    data: MessageTemplate[K],
  ) {
    const message: SystemMessage = {
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
        type: "player",
        isAI: player.isAI as boolean,
        data: player.nickname,
      },
    });
  }
}
