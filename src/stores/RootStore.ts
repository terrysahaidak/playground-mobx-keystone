import { EntitiesStore } from './EntitiesStore';
import {
  model,
  Model,
  modelAction,
  prop,
  types,
  Ref,
} from 'mobx-keystone';
import { TodoModel, todoRef } from './Todos/TodoModel';
import { TodoList } from './Todos/TodoListStore';
import { computed } from 'mobx';

@model('RootStore')
export class RootStore extends Model({
  todoList: prop<TodoList>(() => new TodoList({})),
  selected: prop<Ref<TodoModel> | undefined>(),
  entities: prop<InstanceType<typeof EntitiesStore>>(
    () => new EntitiesStore({}),
  ),
}) {
  @modelAction setSelected(todo: TodoModel) {
    this.selected = todoRef(todo);
  }

  @modelAction addTodo(text: string) {
    const todo = new TodoModel({ text });
    this.todoList.list.push(todo);

    // there is no todos here for some reason
    // this.entities.todos.
  }

  @computed
  get isLoading(): boolean {
    return this.todoList.list.some(
      (item) => item.toggleCompleted.inProgress,
    );
  }
}
