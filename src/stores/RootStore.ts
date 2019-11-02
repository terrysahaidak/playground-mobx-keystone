import {
  model,
  Model,
  modelAction,
  prop,
  Ref,
  objectMap,
} from 'mobx-keystone';
import { EntitiesStore } from './EntitiesStore';
import { GroupList } from './Group/GroupListStore';
import { GroupModel, groupRef } from './Group/GroupModel';

@model('RootStore')
export class RootStore extends Model({
  groupList: prop<GroupList>(() => new GroupList({})),
  selected: prop<Ref<GroupModel> | undefined>(),
  entities: prop<EntitiesStore>(() => new EntitiesStore({})),
  collection: prop(() => objectMap<GroupModel>()),
}) {
  @modelAction setSelected(group: GroupModel) {
    this.selected = groupRef(group);
    const item = this.entities.todos.get('0');
    if (item) {
      item.completed;
    }
  }
}
