// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import { Provider, store } from './stores/createStore';

// ReactDOM.render(
//   <Provider value={store}>
//     <App />
//   </Provider>,
//   document.getElementById('root'),
// );

import {
  Model,
  model,
  prop,
  Ref,
  modelAction,
  getRoot,
  objectMap,
  customRef,
  getSnapshot,
  fromSnapshot,
} from 'mobx-keystone';
import uuid from 'uuid/v4';

@model('TodoModel')
export class TodoModel extends Model({
  id: prop<string>(() => uuid()),
  text: prop<string>(''),
}) {
  @modelAction select() {
    getRoot<RootStore>(this).setSelected(this.id);
  }
}

const todoRef = customRef<TodoModel>('todo ref', {
  getId(ref) {
    return ref.id;
  },

  resolve(ref) {
    return getRoot<RootStore>(ref).todos.get(ref.id);
  },
});

@model('RootStore')
export class RootStore extends Model({
  todos: prop(() => objectMap<TodoModel>()),
  selected: prop<Ref<TodoModel> | undefined>(),
}) {
  @modelAction
  setSelected(todoId: string) {
    this.selected = todoRef(todoId);
  }

  @modelAction
  addTodo(text: string) {
    const todo = new TodoModel({ text });

    this.todos.set(todo.id, todo);
  }
}

const rootStore = new RootStore({});

rootStore.addTodo('Hey');
rootStore.addTodo('Ho');

const snapshot = {
  ...(getSnapshot(rootStore) as any),
};

// @ts-ignore
// snapshot.selected = {
//   id: Object.keys(snapshot.todos.items)[0],
// };

const id = Object.keys(snapshot.todos.items)[0];
snapshot.selected = getSnapshot(todoRef(id));

const newRootStore = fromSnapshot<RootStore>(snapshot);

console.log(snapshot);

// @model('Application')
// class Application extends Model({}) {
//   get post() {
//     // how to get the post itself here?
//   }
// }

// @model('Post')
// class Post extends Model({
//   application: prop<Ref<Application> | undefined>(),
// }) {
//   @modelAction
//   setApplication(application: Application) {
//     this.application = applicationRef(application);
//   }
// }

// @model('RootStore')
// class RootStore extends Model({
//   applicationCollection: prop(() => objectMap<Application>()),
//   posts: prop<Post[]>(() => []),
// }) {}
