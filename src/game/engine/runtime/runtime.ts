import type { PromiseManager } from "./promiseManager.js";
import type { TimerData, TimerManager } from "./timerManager.js";

export interface RuntimePromise {
  promise: Promise<boolean> | undefined;
  resolve: ((result: boolean) => void) | undefined;
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
  ) {
    this.promiseMngr.setRuntimePromise(name);

    // Set up a timeout, if provided
    if (autoResolveTimer) {
      this.timerMngr.cleanupRuntimeTimer(name);
      this.timerMngr.setRuntimeTimer(
        name,
        () => this.resolveRuntimePromise(name, autoResolveValue),
        autoResolveTimer,
      );
    }
  }

  resolveRuntimePromise(name: string, result: boolean) {
    const promise = this.getRuntimePromise(name);
    if (!promise) {
      console.warn(
        `[Runtime] Attempted to resolve non-existend or expired promise: ${name}`,
      );
      return;
    }

    // 1. Cleanup timers (if exist)
    this.timerMngr.cleanupRuntimeTimer(name);
    this.timerMngr.cleanupBroadcastedRuntimeTimer(name);

    // 2. Resolve promise
    this.promiseMngr.resolveRuntimePromise(name, result);
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

  public async waitForClientAck(
    ackKey: string,
    timeoutMs: number = 5000,
  ): Promise<boolean> {
    this.setRuntimePromise(ackKey, timeoutMs, false);

    const promiseWrapper = this.getRuntimePromise(ackKey);
    const isOk = await promiseWrapper?.promise;

    return Boolean(isOk);
  }

  public handleClientAck(ackKey: string) {
    this.resolveRuntimePromise(ackKey, true);
  }
}
