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
import createThunk, { thunk } from '../utils/createThunk';
import { Api } from '../../Api';

@model('GroupList')
export class GroupList extends Model({
  list: prop<Ref<GroupModel>[]>(() => []),
}) {
  @thunk() fetch = createThunk(
    (id: number) =>
      async function(this: GroupList, flow) {
        const groups = await Api.Groups.getAll();

        const result = flow.merge<string[]>(groups, GroupCollection);

        try {
          flow.update(() => {
            this.list = result.map(groupRef);
          });
        } catch (err) {
          debugger;
        }
      },
  );

  @modelAction
  remove(group: GroupModel) {
    const index = this.list.findIndex((ref) => ref.current === group);

    if (index > -1) {
      this.list.splice(index);
    }
  }
}
