import { SnapshotInOf, ModelClass, AnyModel, ModelCreationData } from 'mobx-keystone';
// import { normalize } from 'normalizr';
import { TodoModel } from './Todos/TodoModel';
import { GroupModel } from './Group/GroupModel';
import { EntityOptions, EntityModel, Schema } from './utils/types';

function assertEntityModel(model: any): model is EntityModel {
  return typeof model.entityOptions === 'object';
}

interface Entities {
  [key: string]: {
    [id: string]: ModelCreationData<EntityModel>;
  }
}

function normalize<T extends any>(
  data: T,
  model: EntityModel,
  collection = false,
) {
  if (typeof data === 'undefined') {
    throw new Error('normalize: missing data');
  }

  if (collection && !Array.isArray(data)) {
    throw new Error(
      `normalize: data should be an array. Got ${typeof data}`,
    );
  }

  if (!assertEntityModel(model)) {
    throw new Error('normalize: model should have entityOptions');
  }

  let result = collection ? [] : null;
  const entities:  = {}

  function run() {

  }

  const { schema, entities, idAttribute } = model.entityOptions;


}
