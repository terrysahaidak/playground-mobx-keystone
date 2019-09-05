import {
  Model,
  model,
  prop,
  getRoot,
  modelAction,
  getParent,
} from 'mobx-keystone';
import uuid from 'uuid/v4';
import { RootStore } from '../RootStore';
import createThunk from '../utils/createThunk';
import { createRef } from '../utils/createEntityReference';
import { TodoList } from './TodoListStore';

const delay = (time: number) =>
  new Promise((res) => setTimeout(res, time));

@model('Todo')
export class TodoModel extends Model({
  id: prop<string>(() => uuid()),
  text: prop<string>(''),
  completed: prop<boolean>(false),
}) {
  toggleCompleted = createThunk(this, () => {
    return async (flow) => {
      flow.update(() => {
        this.completed = !this.completed;
      });

      await delay(1000);
    };
  });

  @modelAction remove() {
    const parent = getParent<TodoList>(this);

    if (parent) {
      parent.remove(this);
    }
  }
}

export const todoRef = createRef<TodoModel>('todos');
