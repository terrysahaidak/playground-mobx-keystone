import {
  model,
  Model,
  modelAction,
  prop,
  Ref,
  objectMap,
} from 'mobx-keystone';
import { EntitiesStore, IEntityStore } from './EntitiesStore';
import { GroupList } from './Group/GroupListStore';
import { GroupModel, groupRef } from './Group/GroupModel';

@model('RootStore')
export class RootStore extends Model({
  groupList: prop<GroupList>(() => new GroupList({})),
  selected: prop<Ref<GroupModel> | undefined>(),
  entities: prop<IEntityStore>(() => new EntitiesStore({})),
  collection: prop(() => objectMap<GroupModel>()),
}) {
  @modelAction setSelected(group: GroupModel) {
    this.selected = groupRef(group);
    const item = this.entities.todos.collection.get('0');
    const testProp = this.entities.groups.testProp;
    if (item) {
      item.completed;
    }
  }
}
