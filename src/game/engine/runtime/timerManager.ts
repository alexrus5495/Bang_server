import {
  BroadcastedTimerData,
  sendTimerUpdate,
} from "../../../lib/sendTimerUpdate.js";

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
      this.cleanupRuntimeTimer(name);
      handler();
    }, timeout);
  }

  public cleanupRuntimeTimer(name: string) {
    if (this.timers[name] && this.timers[name].timer) {
      clearTimeout(this.timers[name].timer);
      delete this.timers[name];
    }
  }

  public cleanupBroadcastedRuntimeTimer(name: string) {
    if (this.timers[name] && this.timers[name].timer) {
      clearInterval(this.timers[name].timer);
      delete this.timers[name];
    }
  }

  public setBroadcastedRuntimeTimer(
    name: string,
    handler: () => void,
    timeout: number,
    receiverID: string | string[],
  ) {
    this.cleanupBroadcastedRuntimeTimer(name);

    // 1. Start timer
    const startTime = Date.now();

    // 2. Form and send the first tick data
    // Otherwise setInterval below would only send data 1 sec after timer has been
    // created. It could cause visual bugs on the client side.
    const initialRemaining = Math.ceil(timeout / 1000);
    const initialTimerData: BroadcastedTimerData = {
      timerId: name,
      currentValue: initialRemaining,
      maxValue: timeout,
    };

    if (typeof receiverID === "string") {
      sendTimerUpdate(receiverID, initialTimerData);
    } else {
      for (const receiver of receiverID) {
        sendTimerUpdate(receiver, initialTimerData);
      }
    }

    if (!this.timers[name]) this.timers[name] = {};

    this.timers[name].timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.ceil((timeout - elapsed) / 1000);

      const timerData: BroadcastedTimerData = {
        timerId: name,
        currentValue: remaining,
        maxValue: timeout,
      };

      if (typeof receiverID === "string") {
        sendTimerUpdate(receiverID, timerData);
      } else {
        for (const receiver of receiverID) {
          sendTimerUpdate(receiver, timerData);
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
