import React from "react";
import "./App.css";
import TodoList from "./components/TodoList";

function App() {
  return (
    <div className="App">
      <div className="container">
        <h1>Todo App</h1>
        <p>
          Todo app where you can add, edit, complete, delete and filter todos
        </p>

        <TodoList title="Personal Tasks" />
      </div>
    </div>
  );
}

export default App;
