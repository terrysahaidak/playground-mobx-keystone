import { getRoot, customRef, AnyModel, Ref, rootRef } from 'mobx-keystone';
import { ICollectionModel } from './collectionModel';

export function createRef<T extends AnyModel>(
  entityName: string,
  idAttribute: string = 'id',
) {
  const entityRef = customRef<T>(`${entityName}-ref`, {
    getId(item) {
      return (item as any)[idAttribute];
    },

    resolve(ref: Ref<T>): T | undefined {
      const root = getRoot<any>(ref);
      const entity = root.entities[entityName] as ICollectionModel<T>;

      const item = entity.get(ref.id) as T | undefined;

      return item;
    },
  });

  return entityRef;
}
