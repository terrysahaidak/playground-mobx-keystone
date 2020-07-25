import {
  Model,
  model,
  prop,
  getRoot,
  modelAction,
  getParent,
  ModelData,
  SnapshotInOf,
  ModelCreationData,
} from 'mobx-keystone';
import uuid from 'uuid/v4';
import {
  createThunk,
  thunk,
  createRef,
  asEntityOptions,
} from '../../../libs/mobx-keystone-collections';

import { TodoList } from './TodoListStore';
import { computed } from 'mobx';

const delay = (time: number) =>
  new Promise((res) => setTimeout(res, time));

@model('Todo')
export class TodoModel extends Model({
  id: prop<string>(() => uuid()),
  text: prop<string>(),
  completed: prop<boolean>(false),
}) {
  @modelAction setText(newText: string) {
    this.text = newText;
  }

  @computed getTextAndCompleted() {
    return this.text + this.completed;
  }
}

type IBackendTodo = {
  title: string;
};

const json: ModelCreationData<TodoModel> = {
  text: 'test',
};

const m = new TodoModel(json);

export const todoRef = createRef<TodoModel>('todos');
