import React from "react";
import "./App.css";
import TodoList from "./components/TodoList";

function App() {
  return (
    <div className="App">
      <div className="container">
        <h1>Interactive Todo App</h1>
        <p>Now the checkboxes work! Try clicking them.</p>

        <TodoList title="Personal Tasks" />
      </div>
    </div>
  );
}

export default App;
