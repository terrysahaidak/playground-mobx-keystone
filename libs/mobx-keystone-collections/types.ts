import { ModelClass, AnyModel, BaseModel } from 'mobx-keystone';

// these indicate the basic constraint
interface Schema {
  [k: string]: ModelClass<AnyModel>; // any model class
  // note that we can not enforce typescript to only take models wrapped with the @model decorator though
}

// these indicate the basic constraint
export interface EntityOptions {
  entities: string;
  idAttribute?: string;
  schema?: Schema;
}

