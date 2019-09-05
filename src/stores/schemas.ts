import { SnapshotInOf } from 'mobx-keystone';
import { schema, SchemaArray, SchemaObject } from 'normalizr';
import { TodoModel } from './Todos/TodoModel';
import { GroupModel } from './Group/GroupModel';

export const Todo = new schema.Entity<SnapshotInOf<TodoModel>>(
  'todos',
);
export const TodoCollection = [Todo];

export const Group = new schema.Entity<SnapshotInOf<GroupModel>>(
  'groups',
  {
    todos: TodoCollection,
  },
);
export const GroupCollection = [Group];
