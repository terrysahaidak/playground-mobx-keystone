import React, { useContext } from 'react';
import { RootStore } from './RootStore';
import {
  registerRootStore,
  AnyModel,
  onSnapshot,
} from 'mobx-keystone';

// const rootStoreSnapshot = fromSnapshot<RootStore>({
//   todoList: {
//     list: [],
//     $modelType: 'TodoListStore',
//   },
// });
export function createStore() {
  const rootStore = new RootStore({});
  registerRootStore(rootStore);

  // onSnapshot(rootStore, (snapshot) => {
  //   console.log('Snapshot', { snapshot });
  // });

  return rootStore;
}

export const store = createStore();

const KeystoneContext = React.createContext<RootStore>(store);

export const Provider = KeystoneContext.Provider;

export const useKeystone = () =>
  // mapStateToProps?: (rootStore: RootStore) => Partial<RootStore>,
  {
    const value = useContext(KeystoneContext);

    // if (typeof mapStateToProps !== 'undefined') {
    //   return mapStateToProps(value);
    // }

    return value;
  };
