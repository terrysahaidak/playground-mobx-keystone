import {
  Model,
  model,
  prop,
  tProp,
  types,
  getRoot,
  modelAction,
  customRef,
  getParent,
} from 'mobx-keystone';
import uuid from 'uuid/v4';
import { RootStore } from '../RootStore';
import createThunk from '../utils/createThunk';
import { TodoList } from './TodoListStore';

const delay = (time: number) =>
  new Promise((res) => setTimeout(res, time));

export const todoRef = customRef<TodoModel>('Todo ref', {
  getId(item) {
    return item.id;
  },

  resolve(ref) {
    return getRoot<RootStore>(ref).todoList.list.find(
      (item) => item.id === ref.id,
    );
  },
});

@model('Todo')
export class TodoModel extends Model({
  id: prop<string>(() => uuid()),
  text: prop<string>(''),
  completed: prop<boolean>(false),
}) {
  toggleCompleted = createThunk(() => {
    return async (flow) => {
      const oldValue = this.completed;

      try {
        flow.start();
        flow.start();

        flow.update(() => {
          this.completed = !this.completed;
        });

        await delay(1000);

        flow.success();
      } catch (err) {
        flow.failed(err, true);
      }
    };
  });

  @modelAction
  select() {
    getRoot<RootStore>(this).setSelected(this);
  }

  @modelAction remove() {
    const parent = getParent<TodoList>(this);

    if (parent) {
      parent.remove(this);
    }
  }
}
