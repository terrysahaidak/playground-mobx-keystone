import { schema } from './../../../libs/mobx-keystone-collections/normalize';
import { asEntityOptions, entity } from '../../../libs/mobx-keystone-collections';
import {
  Model,
  model,
  prop,
  Ref,
  modelAction,
  ModelCreationData,
} from 'mobx-keystone';
import uuid from 'uuid/v4';
import { createRef } from '../../../libs/mobx-keystone-collections';
import { TodoModel, todoRef } from '../Todos/TodoModel';

@model('Group')
export class GroupModel extends Model({
  id: prop<string>(() => uuid()),
  title: prop<string>(''),
  todos: prop<Ref<TodoModel>[]>(() => []),
}) {
  static ref = createRef<GroupModel>('groups');

  @modelAction select() {
    // getRoot<RootStore>().;
  }
}

type IGroup = keyof ModelCreationData<GroupModel>

export const groupRef = createRef<GroupModel>('groups');

const GroupSchema = schema.entity(GroupModel);
