import { getRoot, runUnprotected } from 'mobx-keystone';
import { computed, observable, action } from 'mobx';
import {
  normalize,
  Schema,
  SchemaArray,
  SchemaObject,
} from 'normalizr';
import uuid from 'uuid/v1';
import { Arguments } from 'yargs';

export function thunk(auto = true, throwError = true) {
  return function decorator(target: any, key: string) {
    let asyncInstance: ReturnType<typeof createThunk> = target[key];

    asyncInstance._init({ model: target, auto, throwError });

    const getter = (): typeof asyncInstance => {
      return asyncInstance;
    };

    const setter = (next: any) => {
      throw new Error('Cannot set the new value to the thunk');
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: false,
      configurable: true,
    });
  };
}

// export default function modelThunk(auto?: boolean) {
//   return function decorator(target: any, propertyKey: string): any {
//     const thunk = new AsyncModel(target[propertyKey] as Thunk, auto);

//     return {
//       set: function() {
//         return;
//       },
//       get: function() {
//         return thunk;
//       },
//       enumerable: false,
//       configurable: true,
//     };
//   };
// }

export function createThunk<A extends any[]>(
  thunk: (
    ...args: A
  ) => (flow: ReturnType<typeof createThunk>) => any,
) {
  class AsyncModel {
    private _model: any;
    private _auto: boolean = true;
    private _throwError: boolean = true;

    constructor() {
      // this.run = this.run.bind(this);
    }

    _init({
      model,
      auto,
      throwError,
    }: {
      model: any;
      auto: boolean;
      throwError: boolean;
    }) {
      this._model = model;
      this._auto = auto;
      this._throwError = throwError;
    }

    @observable inProgress: boolean = false;
    @observable inProgressRetry: boolean = false;
    @observable error: boolean = false;
    @observable hasEverBeenRan: boolean = false;
    @observable throwable: boolean = this._throwError;

    @computed get isError() {
      return Boolean(this.error);
    }

    @computed get canBeRun() {
      return !this.error && !this.inProgress;
    }

    @computed get inProgressAgain() {
      return this.inProgress && this.hasEverBeenRan;
    }

    @action
    start(retry = false) {
      if (retry) {
        this.inProgressRetry = true;
      } else {
        this.inProgress = true;
      }

      this.error = false;
    }

    @action
    success() {
      if (!this.hasEverBeenRan) {
        this.hasEverBeenRan = true;
      }

      if (this.inProgressRetry) {
        this.inProgressRetry = false;
      } else {
        this.inProgress = false;
      }
    }

    @action
    failed(err: any, throwError = this.throwable) {
      console.error(err);

      if (!this.hasEverBeenRan) {
        this.hasEverBeenRan = true;
      }

      if (this.inProgressRetry) {
        this.inProgressRetry = false;
      } else {
        this.inProgress = false;
      }

      this.error = true;

      // const response = err?.response;

      // this.error = {
      //   message: response?.data?.message ?? err?.message,
      //   status: response?.status ?? null,
      //   reason: response?.data?.reason ?? null,
      //   errorCode: response?.data?.error ?? null,
      //   meta: response?.data?.meta ?? null,
      // };

      if (throwError) {
        throw err;
      }
    }

    normalize(collection: any, scheme: Schema) {
      return normalize(collection, scheme);
    }

    @action
    throwError(value: boolean) {
      this.throwable = value;
    }

    @action
    merge<R extends any>(collection: any, scheme: Schema) {
      const { result, entities } = normalize<any, any, R>(
        collection,
        scheme,
      );

      getRoot(this._model).entities.merge(entities);

      return result;
    }

    @action
    async auto(promise: { (): any; (): void }) {
      try {
        this.start();

        await promise();

        this.success();
      } catch (err) {
        this.failed(err);
      }
    }

    update(cb: () => void) {
      runUnprotected(cb);
    }

    @action
    run<R extends Promise<any>, T extends typeof thunk>(
      ...args: Parameters<T>
    ): R {
      const promise = () => {
        const _thunk = thunk(...args);

        return _thunk.bind(this._model)(this);
      };

      if (this._auto) {
        return this.auto(promise) as R;
      }

      return promise();
    }
  }

  return new AsyncModel();
}

