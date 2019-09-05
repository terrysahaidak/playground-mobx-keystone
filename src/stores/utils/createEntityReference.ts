import { getRoot, customRef, AnyModel } from 'mobx-keystone';
import { ICollectionStore } from './createCollectionStore';

export function createRef<T extends AnyModel>(
  entityName: string,
  idAttribute: string = 'id',
) {
  const entityRef = customRef<T>(`${entityName} ref`, {
    getId(item) {
      return (item as any)[idAttribute];
    },

    resolve(ref) {
      const root = getRoot<any>(ref);
      const entity = root.entities[entityName] as ICollectionStore;
      const resolved = entity.get(ref.id);

      if (!resolved) {
        return undefined;
      }

      return resolved as T;
    },
  });

  return entityRef;
}
