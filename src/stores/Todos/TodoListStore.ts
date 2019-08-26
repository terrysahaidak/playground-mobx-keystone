import {
  Model,
  model,
  tProp,
  types,
  getRoot,
  customRef,
  prop,
  modelAction,
} from 'mobx-keystone';
import { TodoModel } from './TodoModel';

@model('TodoList')
export class TodoList extends Model({
  list: prop<TodoModel[]>(() => []),
}) {
  @modelAction
  remove(todo: TodoModel) {
    this.list.splice(this.list.indexOf(todo));
  }
}
