import { EntityModel, Schema } from './types';
import {
  SnapshotInOf,
  ModelClass,
  AnyModel,
  ModelCreationData,
  Ref,
  isModel,
} from 'mobx-keystone';
import { schema as normalizrSchema } from 'normalizr';

interface Entities {
  [key: string]: {
    [id: string]: ModelCreationData<EntityModel>;
  };
}

function normalize<T extends any>(
  data: T,
  model: EntityModel,
  collection = false,
) {}

type SchemaDefinition<
  T extends AnyModel,
  MD = ModelCreationData<T>
> = {
  [K in keyof MD]: any;
};

export function entity<T extends AnyModel>(
  model: T & { ref: Ref<T> },
  definition: SchemaDefinition<T> | {} = {},
  options: normalizrSchema.EntityOptions = {},
) {
  if (!isModel(model.ref))

  return new normalizrSchema.Entity()
}

export const schema = {
  entity,
}
