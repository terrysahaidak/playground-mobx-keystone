import { CollectionStore } from '../utils/createCollectionStore';
import { TodoModel } from './TodoModel';
import { ExtendedModel, model } from 'mobx-keystone';

@model('TodoCollectionStore')
export class TodoCollectionStore extends CollectionStore<TodoModel>(
  TodoModel,
) {
  // you can add all the async actions here
}

export type ITodoCollectionStore = InstanceType<
  typeof TodoCollectionStore
>;
