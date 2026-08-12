import type { RuntimePromise } from "./runtime.js";

export class PromiseManager {
  promises: Record<string, RuntimePromise>;

  constructor() {
    this.promises = {};
  }

  setRuntimePromise(name: string) {
    let resolver: ((result: boolean) => void) | undefined;

    const promise = new Promise<boolean>((resolve) => {
      resolver = resolve;
    });

    this.promises[name] = {
      promise,
      resolve: resolver,
    };
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
    };
  }
}
