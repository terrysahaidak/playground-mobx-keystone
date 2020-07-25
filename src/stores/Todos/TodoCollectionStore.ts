import { CollectionModel } from '../../../libs/mobx-keystone-collections';
import { TodoModel } from './TodoModel';
import { model } from 'mobx-keystone';

@model('TodoCollectionStore')
export class TodoCollectionStore extends CollectionModel<TodoModel>(
  TodoModel,
) {
  // you can add all the async actions here
}
