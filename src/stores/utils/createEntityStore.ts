import {
  Model,
  model,
  prop,
  AnyModel,
  ModelClass,
  SnapshotInOf,
  objectMap,
  modelAction,
  ExtendedModel,
} from 'mobx-keystone';
import { computed } from 'mobx';
import { ModelProps } from 'mobx-keystone/dist/model/prop';
import { Schema, normalize } from 'normalizr';

type EntityID = number | string;

export const createCollectionStore = <
  T extends AnyModel,
  EntityType = ModelClass<T>
>(
  EntityModel: EntityType,
) => {
  class CollectionStore extends Model({
    collection: prop(() => objectMap<typeof EntityModel>()),
  }) {
    @computed get(id: EntityID) {
      return this.collection.get(String(id));
    }

    @computed has(id: EntityID) {
      return this.collection.has(String(id));
    }

    @modelAction add(id: EntityID, value: EntityType) {
      this.collection.set(String(id), value);
    }

    @modelAction destroy(id: EntityID) {
      this.collection.delete(String(id));
    }

    @modelAction update(id: EntityID, value: SnapshotInOf<T>) {
      const item = this.collection.get(String(id)) as EntityType;
      Object.assign(item, value);
    }
  }

  return CollectionStore;
};

export function createEntitiesStore<
  T extends {
    [k: string]: AnyModel;
  },
  Stores = {
    [P in keyof T]: ModelClass<T[P]>;
  }
>(collectionStores: Stores) {
  const modelProps = Object.entries(collectionStores).reduce(
    (acc, [key, value]) => {
      acc[key] = prop<InstanceType<typeof value>>(
        () => new value({}),
      );

      return acc;
    },
    {} as ModelProps,
  );

  @model('EntitiesStore')
  class EntitiesStore extends Model(modelProps) {
    @modelAction merge(normalizedEntities: { [k: string]: Object }) {
      Object.entries(normalizedEntities).forEach(
        ([key, normalizedEntity]) => {
          const storeEntity = this[key] as InstanceType<
            ReturnType<typeof createCollectionStore>
          >;

          if (!storeEntity) {
            return;
          }

          Object.entries(normalizedEntity).forEach(
            ([nestedKey, value]) => {
              if (storeEntity.has(nestedKey)) {
                storeEntity.update(nestedKey, value);
              } else {
                storeEntity.collection.set(nestedKey, value);
              }
            },
          );
        },
      );
    }

    normalizeMerge(item: any, schema: Schema) {
      const { result, entities } = normalize(item, schema);

      this.merge(entities);

      return result;
    }
  }

  return EntitiesStore;
}
