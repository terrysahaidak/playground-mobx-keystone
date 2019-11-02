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
import createThunk, { thunk } from '../utils/createThunk';
import { createRef } from '../utils/createEntityReference';
import { TodoList } from './TodoListStore';

const delay = (time: number) =>
  new Promise((res) => setTimeout(res, time));

@model('Todo')
export class TodoModel extends Model({
  id: prop<string>(() => uuid()),
  text: prop<string>(),
  completed: prop<boolean>(false),
}) {

}

type IBackendTodo= {
  title: string;
}

const json: ModelCreationData<TodoModel> = {
  text: 'test',
}

const m = new TodoModel(json);

export const todoRef = createRef<TodoModel>('todos');
