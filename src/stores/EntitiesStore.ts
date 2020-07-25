import { model, prop } from 'mobx-keystone';
import { TodoCollectionStore } from './Todos/TodoCollectionStore';
import { GroupCollectionStore } from './Group/GroupCollectionStore';
import { EntitiesModel } from '../../libs/mobx-keystone-collections';

@model('EntitiesStore')
export class EntitiesStore extends EntitiesModel({
  todos: prop<TodoCollectionStore>(() => new TodoCollectionStore({})),
  groups: prop<GroupCollectionStore>(
    () => new GroupCollectionStore({}),
  ),
}) {
  // you can add all the async actions here
}
