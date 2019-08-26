import { TodoCollectionStore } from './Todos/TodoCollectionStore';
import { createEntitiesStore } from './utils/createEntityStore';

export const EntitiesStore = createEntitiesStore({
  todos: TodoCollectionStore,
});
