import React from "react";
import { todoStore } from "../features/todos/stores/TodoStore";
import { priorityStore } from "../features/priorities/stores/PriorityStore";

export const RootStoreContext = React.createContext({
  todoStore,
  priorityStore,
});

export const RootStoreProvider = ({ children, value }) => {
  return (
    <RootStoreContext.Provider value={value ?? { todoStore, priorityStore }}>
      {children}
    </RootStoreContext.Provider>
  );
};

export const useStores = () => React.useContext(RootStoreContext);
