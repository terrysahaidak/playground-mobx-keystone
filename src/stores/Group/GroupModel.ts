import {
  Model,
  model,
  prop,
  Ref,
  modelAction,
  getRoot,
  SnapshotInOf,
} from 'mobx-keystone';
import uuid from 'uuid/v4';
import { createRef } from '../utils/createEntityReference';
import { TodoModel, todoRef } from '../Todos/TodoModel';
import { RootStore } from '../RootStore';

@model('Group')
export class GroupModel extends Model({
  id: prop<string>(() => uuid()),
  title: prop<string>(''),
  todos: prop<Ref<TodoModel>[]>(() => []),
}) {
  @modelAction select() {
    getRoot<RootStore>(this).setSelected(this);
  }
}

export const groupRef = createRef<GroupModel>('groups');
