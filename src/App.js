import React from "react";
import "./App.css";
import TodoItem from "./components/TodoItem";

function App() {
  // Static todo data for demonstration
  const staticTodos = [
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Build Todo App", completed: true },
    { id: 3, text: "Write Tests", completed: false },
  ];

  return (
    <div className="App">
      <div className="container">
        <h1>Static Todo Items Demo</h1>
        <p>These are static TodoItem components - no interactivity</p>

        <ul className="todo-list">
          {staticTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
