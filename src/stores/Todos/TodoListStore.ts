import {
  Model,
  model,
  tProp,
  types,
  getRoot,
  customRef,
  prop,
  modelAction,
  AnyModel,
} from 'mobx-keystone';
import { TodoModel } from './TodoModel';

@model({
  'TodoList',
  entities: 'todos',
  schema,
})
export class TodoList extends ListModel(TodoModel) {
  @modelAction
  remove(todo: TodoModel) {
    this.list.splice(this.list.indexOf(todo));
  }
}

interface ListModelClass<TModel> {
  list: TModel[];
  addToBegin(item: TModel | TModel[]): void;
  addToEnd(item: TModel | TModel[]): void;
  remove(item: TModel): void;
  removeById(id: string): void;
}


function ListModel<T extends AnyModel>(model: T, modelDefinition: object): ListModelClass<T>;


class RootStore extends RootModel({}) {

}


