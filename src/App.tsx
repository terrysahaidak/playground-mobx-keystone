import './App.css';
import React, { useState, ChangeEvent, useEffect } from 'react';
import { useKeystone } from './stores/createStore';
import { useObserver } from 'mobx-react';
import { TodoModel } from './stores/Todos/TodoModel';
import { Ref } from 'mobx-keystone';
import { GroupList as IGroupList } from './stores/Group/GroupListStore';
import { GroupModel } from './stores/Group/GroupModel';

interface TodoListProps {
  list: Ref<TodoModel>[];
}

function TodoList({ list }: TodoListProps) {
  return useObserver(() => {
    try {
      const text = list.map((item) => item.current.text);
    } catch (err) {
      console.log(err);
    }

    return (
      <ul>
        {list.map((item) => (
          <li
            style={{
              textDecoration: item.current.completed
                ? 'line-through'
                : 'none',
            }}
            // onClick={item.current.toggleCompleted.run}
          >
            {item.current.text}

            <button
              onClick={(evt) => {
                evt.stopPropagation();
                item.current.remove();
              }}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    );
  });
}

interface GroupListProps {
  list: IGroupList;
}

function GroupList({ list }: GroupListProps) {
  function handleSelect(item: GroupModel) {
    return (evt: React.MouseEvent<HTMLElement>) => {
      evt.preventDefault();

      item.select();
    };
  }

  return useObserver(() => {
    return (
      <ul>
        {list.list.map((item) => (
          <li key={item.id} onClick={handleSelect(item.current)}>
            {item.current.title}
          </li>
        ))}
      </ul>
    );
  });
}

function App() {
  const rootStore = useKeystone();
  const { groupList } = rootStore;
  const [value, setValue] = useState('');

  useEffect(() => {
    groupList.fetch.run();
  }, []);

  function handleAdd() {
    // rootStore.addTodo(value);
    setValue('');
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  return useObserver(() => {
    const selected =
      rootStore.selected &&
      rootStore.selected.isValid &&
      rootStore.selected.current;

    return (
      <div className="App">
        <main className="main">
          <aside>
            <GroupList list={groupList} />
          </aside>

          <div className="list">
            <header className="App-header">
              <input value={value} onChange={handleChange} />
              <button onClick={handleAdd} type="button">
                Add
              </button>
            </header>
            {rootStore.selected && (
              <TodoList list={rootStore.selected.current.todos} />
            )}
          </div>
        </main>
      </div>
    );
  });
}

export default App;
