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
// import { RootStore } from '../RootStore';

// const ErrorModel = types.model({
//   message: '',
//   status: types.maybeNull(types.number),
//   reason: types.maybeNull(types.string),
//   errorCode: types.maybeNull(types.string),
//   meta: types.maybeNull(types.frozen({})),
// });
type Thunk = (...args: any[]) => (flow: AsyncModel) => any;

export type SchemaOf<T> = T extends SchemaArray<infer R>
  ? R[]
  : T extends SchemaObject<infer R>
  ? R
  : never;

export class AsyncModel {
  constructor(
    private _model: any,
    private _thunk: Thunk,
    private _auto: boolean = true,
    private _throwError: boolean = true,
  ) {
    this._thunk = _thunk;
    this._model = _model;
    this._auto = _auto;
    this._throwError = _throwError;

    this.run = this.run.bind(this);
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
  run<T = Thunk>(args: Parameters<T> {
    const promise = () => this._thunk(...args)(this);

    if (this._auto) {
      return this.auto(promise);
    }

    return promise();
  }
}

export function thunk(auto = true, throwError = true) {
  return function decorator(target: any, key: string) {
    let thunk: Thunk = target[key];

    const instance = new AsyncModel(target, thunk, auto, throwError);

    const getter = (): AsyncModel => {
      return instance;
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

function castToAsyncModel(thunk: any) {
  return thunk as AsyncModel;
}

export default function createThunk(thunk: Thunk): AsyncModel {
  return castToAsyncModel(thunk);
}
