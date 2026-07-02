import type { EventSystem } from "./eventSystem.js";

export class FlowEvents {
  constructor(private eventSystem: EventSystem) {}

  turnStart(playerId: string) {
    this.eventSystem.register("PLAYER_TURN_START", { playerId });
  }

  turnEnd(playerId: string) {
    this.eventSystem.register("PLAYER_TURN_END", { playerId });
  }

  drawingStart(playerId: string) {
    this.eventSystem.register("PLAYER_DRAWING_START", { playerId });
  }

  drawingEnd(playerId: string) {
    this.eventSystem.register("PLAYER_DRAWING_END", { playerId });
  }

  playingStart(playerId: string) {
    this.eventSystem.register("PLAYER_PLAYING_START", { playerId });
  }

  playingEnd(playerId: string) {
    this.eventSystem.register("PLAYER_PLAYING_END", { playerId });
  }

  discardingStart(playerId: string) {
    this.eventSystem.register("PLAYER_DISCARDING_START", { playerId });
  }

  discardingEnd(playerId: string) {
    this.eventSystem.register("PLAYER_DISCARDING_END", { playerId });
  }
}
