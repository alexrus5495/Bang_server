import type { PromiseManager } from "./promiseManager.js";
import type { TimerData, TimerManager } from "./timerManager.js";

export interface RuntimePromise {
  promise: Promise<boolean> | undefined;
  resolve: ((result: boolean) => void) | undefined;
  counters?: Record<string, number>;
}

export class Runtime {
  private promiseMngr: PromiseManager;
  private timerMngr: TimerManager;

  constructor(promiseMngr: PromiseManager, timerMngr: TimerManager) {
    this.promiseMngr = promiseMngr;
    this.timerMngr = timerMngr;
  }

  setRuntimePromise(
    name: string,
    autoResolveTimer?: number,
    autoResolveValue: boolean = false,
    counters?: Record<string, number>,
  ) {
    this.promiseMngr.setRuntimePromise(name, counters);

    if (autoResolveTimer) {
      this.timerMngr.cleanupRuntimeTimer(name);
      this.timerMngr.setRuntimeTimer(
        name,
        () => this.promiseMngr.resolveRuntimePromise(name, autoResolveValue),
        autoResolveTimer,
      );
    }
  }

  resolveRuntimePromise(name: string, result: boolean) {
    const promise = this.getRuntimePromise(name);
    if (promise) {
      this.promiseMngr.resolveRuntimePromise(name, result);
    } else throw new Error("Failed to find a promise");
  }

  setRuntimeTimer(name: string, handler: () => void, timeout: number) {
    this.timerMngr.setRuntimeTimer(name, handler, timeout);
  }

  cleanupRuntimeTimer(name: string) {
    this.timerMngr.cleanupRuntimeTimer(name);
  }

  setBroadcastedRuntimeTimer(
    name: string,
    handler: () => void,
    timeout: number,
    receiverID: string | string[],
  ) {
    this.timerMngr.setBroadcastedRuntimeTimer(
      name,
      handler,
      timeout,
      receiverID,
    );
  }

  cleanupBroadcastedRuntimeTimer(name: string) {
    this.timerMngr.cleanupBroadcastedRuntimeTimer(name);
  }

  getRuntimePromise(name: string) {
    const promise = this.promiseMngr.promises[name];

    return promise;
  }

  prepareTimer(name: string, timer: TimerData) {
    this.timerMngr.prepareTimer(name, timer);
  }

  getRuntimeTimer(name: string) {
    return this.timerMngr.getTimer(name);
  }
}
