import { model, prop, ExtendedModel } from 'mobx-keystone';
import {
  TodoCollectionStore,
  ITodoCollectionStore,
} from './Todos/TodoCollectionStore';
import {
  GroupCollectionStore,
  IGroupCollectionStore,
} from './Group/GroupCollectionStore';
import { EntitiesModel } from './utils/createEntityStore';

@model('EntitiesStore')
export class EntitiesStore extends EntitiesModel({
  todos: prop<ITodoCollectionStore>(
    () => new TodoCollectionStore({}),
  ),
  groups: prop<IGroupCollectionStore>(
    () => new GroupCollectionStore({}),
  ),
}) {
  // you can add all the async actions here
}

export type IEntityStore = InstanceType<typeof EntitiesStore>;
