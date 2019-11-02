import {
  registerRootStore,
  Model,
  model,
} from 'mobx-keystone';

export function createRootStore() {
  @model('RootStore')
  class RootStore extends Model({ }) {

  }
}
