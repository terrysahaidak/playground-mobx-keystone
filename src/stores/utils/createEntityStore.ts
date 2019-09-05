import { Model, modelAction, ExtendedModel } from 'mobx-keystone';
import { ModelProps, ModelProp } from 'mobx-keystone/dist/model/prop';
import { Schema, normalize } from 'normalizr';

export function EntitiesModel<
  TBaseProps extends {
    [k: string]: ModelProp<any, any>;
  }
>(collectionStores: TBaseProps) {
  class EntitiesStore extends Model(collectionStores as ModelProps) {
    @modelAction merge(normalizedEntities: { [k: string]: Object }) {
      Object.entries(normalizedEntities).forEach(
        ([key, normalizedEntity]) => {
          const storeEntity = this[key] as any;

          if (!storeEntity) {
            return;
          }

          Object.entries(normalizedEntity).forEach(
            ([nestedKey, value]) => {
              if (storeEntity.has(nestedKey)) {
                storeEntity.update(nestedKey, value);
              } else {
                storeEntity.addFromSnapshot(nestedKey, value);
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

  return ExtendedModel(EntitiesStore, collectionStores);
}
