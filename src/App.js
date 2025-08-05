import React from "react";
import "./App.css";
import TodoList from "./components/TodoList";
import { FaGithub } from "react-icons/fa";

function App() {
  const standardTodos = [
    {
      id: 1,
      text: "Learn React",
      completed: false,
      priority: "urgent",
    },
    {
      id: 2,
      text: "Build Todo App",
      completed: true,
      priority: "high",
    },
    {
      id: 3,
      text: "Write Tests",
      completed: false,
      priority: "medium",
    },
    {
      id: 4,
      text: "Learn React Testing",
      completed: false,
      priority: "low",
    },
  ];
  return (
    <div className="App">
      <div className="container">
        <h1>Todo App</h1>
        <p>
          Todo app where you can add, edit, complete, delete and filter todos
        </p>

        <TodoList title="Personal Tasks" standardTodos={[]} />

        <footer>
          <p>
            <a href="https://github.com/Joossensei">
              <FaGithub />
            </a>
          </p>
          <p>
            Made by <a href="https://github.com/Joossensei">Joost Both</a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
