import React from "react";
import { todoStore } from "../features/todos/stores/TodoStore";
import { priorityStore } from "../features/priorities/stores/PriorityStore";
import { userStore } from "../features/users/stores/UserStore";
import { userListStore } from "../features/users/stores/UserListStore";

export const RootStoreContext = React.createContext({
  todoStore,
  priorityStore,
  userStore,
  userListStore,
});

export const RootStoreProvider = ({ children, value }) => {
  return (
    <RootStoreContext.Provider
      value={value ?? { todoStore, priorityStore, userStore, userListStore }}
    >
      {children}
    </RootStoreContext.Provider>
  );
};

export const useStores = () => React.useContext(RootStoreContext);
