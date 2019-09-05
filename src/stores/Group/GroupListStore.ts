import { GroupCollection } from './../schemas';
import {
  Model,
  model,
  Ref,
  prop,
  modelAction,
  SnapshotInOf,
} from 'mobx-keystone';
import { GroupModel, groupRef } from './GroupModel';
import createThunk from '../utils/createThunk';
import { Api } from '../../Api';

@model('GroupList')
export class GroupList extends Model({
  list: prop<Ref<GroupModel>[]>(() => []),
}) {
  fetch = createThunk(this, () => async (flow) => {
    const groups = await Api.Groups.getAll();

    const result = flow.merge<string[]>(groups, GroupCollection);

    try {
      flow.update(() => {
        this.list = result.map(groupRef);
        debugger;
      });
    } catch (err) {
      debugger;
    }
  });

  @modelAction
  remove(group: GroupModel) {
    const index = this.list.findIndex((ref) => ref.current === group);

    if (index > -1) {
      this.list.splice(index);
    }
  }
}
