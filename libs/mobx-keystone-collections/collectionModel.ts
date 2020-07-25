import {
  Model,
  prop,
  model,
  AnyModel,
  ModelClass,
  SnapshotInOf,
  objectMap,
  ExtendedModel,
  modelAction,
  ObjectMap,
} from 'mobx-keystone';

type EntityID = number | string;

export function CollectionModel<
  T extends AnyModel,
  TClass = ModelClass<T>
>(EntityModel: TClass) {
  class CollectionStore extends Model({
    collection: prop<ObjectMap<T>>(() => objectMap()),
  }) {
    get(id: EntityID) {
      return this.collection.get(String(id));
    }

    has(id: EntityID) {
      return this.collection.has(String(id));
    }

    @modelAction add(id: EntityID, value: T) {
      this.collection.set(String(id), value);
    }

    @modelAction addFromSnapshot(
      id: EntityID,
      snapshot: SnapshotInOf<T>,
    ) {
      // @ts-ignore
      const entity = new EntityModel(snapshot);

      this.collection.set(String(id), entity);
    }

    @modelAction destroy(id: EntityID) {
      this.collection.delete(String(id));
    }

    @modelAction update(id: EntityID, value: SnapshotInOf<T>) {
      const item = this.collection.get(String(id));
      Object.assign(item, value);
    }
  }

  return ExtendedModel(CollectionStore, {});
}

type GenericReturnType<F, T> = F extends (x: T) => (infer U) ? U : never

export type ICollectionModel<T> = InstanceType<
  GenericReturnType<typeof CollectionModel, T>
>;

