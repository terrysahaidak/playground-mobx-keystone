import { CollectionStore } from '../utils/createCollectionStore';
import { GroupModel } from './GroupModel';
import { model, modelAction } from 'mobx-keystone';

@model('GroupCollectionStore')
export class GroupCollectionStore extends CollectionStore<GroupModel>(
  GroupModel,
) {
  @modelAction testProp() {
    return 'string';
  }
}

export type IGroupCollectionStore = InstanceType<
  typeof GroupCollectionStore
>;
