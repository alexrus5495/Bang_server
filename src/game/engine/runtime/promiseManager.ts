import type { RuntimePromise } from "./runtime.js";

export class PromiseManager {
  promises: Record<string, RuntimePromise>;

  constructor() {
    this.promises = {};
  }

  setRuntimePromise(name: string, counters?: Record<string, number>) {
    this.cleanupRuntimePromise(name);

    this.promises[name].promise = new Promise<boolean>((resolve) => {
      this.promises[name].resolve = resolve;
    });

    if (counters) {
      this.promises[name].counters = counters;
    }
  }

  resolveRuntimePromise(name: string, result: boolean) {
    const promiseObj = this.promises[name];
    if (promiseObj?.resolve) {
      promiseObj.resolve(result);
      this.cleanupRuntimePromise(name);
    }
  }

  private cleanupRuntimePromise(name: string) {
    this.promises[name] = {
      promise: undefined,
      resolve: undefined,
      counters: undefined,
    };
  }
}
