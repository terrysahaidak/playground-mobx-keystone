import React, { useState, ChangeEvent } from 'react';
import { useKeystone } from './stores/createStore';
import { useObserver } from 'mobx-react';

function App() {
  const rootStore = useKeystone();
  const { todoList } = rootStore;
  const [value, setValue] = useState('');

  function handleAdd() {
    rootStore.addTodo(value);
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
        <header className="App-header">
          <input value={value} onChange={handleChange} />
          <button onClick={handleAdd} type="button">
            Add
          </button>
        </header>

        <p
          style={{
            textDecoration:
              selected && selected.completed
                ? 'line-through'
                : 'none',
          }}>
          Selected: {selected && selected.text}
        </p>
        {rootStore.isLoading && 'Loading'}
        <ul>
          {todoList.list.map((item) => (
            <li
              style={{
                textDecoration: item.completed
                  ? 'line-through'
                  : 'none',
              }}
              onClick={item.toggleCompleted.run}>
              {item.text}

              <button
                onClick={(evt) => {
                  evt.stopPropagation();
                  item.select();
                }}>
                Select
              </button>
              <button
                onClick={(evt) => {
                  evt.stopPropagation();
                  item.remove();
                }}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  });
}

export default App;
