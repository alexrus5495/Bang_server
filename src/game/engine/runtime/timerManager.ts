import { sendTimerUpdate } from "../../../lib/sendTimerUpdate.js";

export type TimerData =
  | {
      timer?: NodeJS.Timeout;
      data?: Record<string, any>;
    }
  | undefined;

export class TimerManager {
  timers: Record<string, TimerData>;

  constructor() {
    this.timers = {};
  }

  public setRuntimeTimer(name: string, handler: () => void, timeout: number) {
    this.cleanupRuntimeTimer(name);

    if (!this.timers[name]) this.timers[name] = {};

    this.timers[name].timer = setTimeout(() => {
      handler();
      this.cleanupRuntimeTimer(name);
    }, timeout);
  }

  public cleanupRuntimeTimer(name: string) {
    if (this.timers[name] && this.timers[name].timer) {
      clearTimeout(this.timers[name].timer);
      this.timers[name] = undefined;
    }
  }

  public cleanupBroadcastedRuntimeTimer(name: string) {
    if (this.timers[name] && this.timers[name].timer) {
      clearInterval(this.timers[name].timer);
      this.timers[name] = undefined;
    }
  }

  public setBroadcastedRuntimeTimer(
    name: string,
    handler: () => void,
    timeout: number,
    receiverID: string | string[],
  ) {
    this.cleanupBroadcastedRuntimeTimer(name);

    const startTime = Date.now();

    if (!this.timers[name]) this.timers[name] = {};

    this.timers[name].timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.ceil((timeout - elapsed) / 1000);

      if (typeof receiverID === "string") {
        sendTimerUpdate(receiverID, remaining);
      } else {
        for (const receiver of receiverID) {
          sendTimerUpdate(receiver, remaining);
        }
      }

      if (remaining <= 0) {
        this.cleanupBroadcastedRuntimeTimer(name);
        handler();
      }
    }, 1000);
  }

  prepareTimer(name: string, timer: TimerData) {
    this.timers[name] = timer;
  }

  getTimer(name: string) {
    return this.timers[name];
  }
}
