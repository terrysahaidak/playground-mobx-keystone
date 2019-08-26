import { getRoot, getParent, runUnprotected } from 'mobx-keystone';
import { computed, observable, action } from 'mobx';
import { normalize, Schema } from 'normalizr';
import uuid from 'uuid/v1';
// import { RootStore } from '../RootStore';

// const ErrorModel = types.model({
//   message: '',
//   status: types.maybeNull(types.number),
//   reason: types.maybeNull(types.string),
//   errorCode: types.maybeNull(types.string),
//   meta: types.maybeNull(types.frozen({})),
// });

type Thunk = (...args: any[]) => (flow: AsyncModel) => any;

export class AsyncModel {
  constructor(private _thunk: Thunk, private _auto?: boolean) {
    this._thunk = _thunk;
    this._auto = _auto;

    this.run = this.run.bind(this);
  }

  @observable inProgress: boolean = false;
  @observable inProgressRetry: boolean = false;
  @observable error: boolean = false;
  @observable hasEverBeenRan: boolean = false;
  @observable throwable: boolean = false;

  @computed
  get isError(): boolean {
    return Boolean(this.error);
  }

  @computed
  get canBeRun(): boolean {
    return !this.error && !this.inProgress;
  }

  @computed
  get inProgressAgain(): boolean {
    return this.inProgress && this.hasEverBeenRan;
  }

  @computed
  get parent(): any {
    return getParent(this, true);
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
  merge(collection: any, scheme: Schema) {
    const { result, entities } = this.normalize(collection, scheme);

    getRoot(this).entities.merge(entities);

    return {
      result,
    };
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
  run(...args: any[]) {
    const promise = () => this._thunk(...args)(this);

    if (this._auto) {
      return this.auto(promise);
    }

    return promise();
  }
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

export default function createThunk(
  thunk: Thunk,
  auto?: boolean,
): AsyncModel {
  const instance = new AsyncModel(thunk, auto);

  return instance;
}
