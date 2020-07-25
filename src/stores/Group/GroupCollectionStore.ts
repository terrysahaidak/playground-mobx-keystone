import { CollectionModel } from '../../../libs/mobx-keystone-collections';
import { GroupModel } from './GroupModel';
import { model, modelAction } from 'mobx-keystone';

@model('GroupCollectionStore')
export class GroupCollectionStore extends CollectionModel<GroupModel>(
  GroupModel,
) {
  @modelAction testProp() {
    return 'string';
  }
}
