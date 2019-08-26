import { createCollectionStore } from './../utils/createEntityStore';
import { TodoModel } from './TodoModel';
import { ExtendedModel, model } from 'mobx-keystone';

@model('TodoCollectionStore')
export class TodoCollectionStore extends ExtendedModel(
  createCollectionStore<TodoModel>(TodoModel),
  {},
) {
  // you can add all the async actions here
}
