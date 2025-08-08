import React, { useState } from "react";
import "./App.css";
import TodoList from "./components/TodoList";
import MenuBar from "./components/MenuBar";
import { FaGithub } from "react-icons/fa";
import PriorityList from "./components/PriorityList";
import EditTodo from "./components/EditTodo";

function App() {
  const [activeMenuItem, setActiveMenuItem] = useState("home");
  const [selectedTodoKey, setSelectedTodoKey] = useState(null);

  const standardTodos = [
    {
      id: 1,
      text: "Learn React",
      completed: false,
      priority: "240fd1f9-f48a-4d46-99ad-c7fe317cb354",
    },
    {
      id: 2,
      text: "Build Todo App",
      completed: true,
      priority: "240fd1f9-f48a-4d46-99ad-c7fe317cb354",
    },
    {
      id: 3,
      text: "Write Tests",
      completed: false,
      priority: "240fd1f9-f48a-4d46-99ad-c7fe317cb354",
    },
    {
      id: 4,
      text: "Learn React Testing",
      completed: false,
      priority: "240fd1f9-f48a-4d46-99ad-c7fe317cb354",
    },
  ];

  const handleMenuClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case "home":
        return selectedTodoKey ? (
          <div className="content-section">
            <EditTodo
              todoKey={selectedTodoKey}
              onBack={() => setSelectedTodoKey(null)}
            />
          </div>
        ) : (
          <div className="content-section">
            <h1>Todo App</h1>
            <p>
              Todo app where you can add, edit, complete, delete and filter
              todos
            </p>
            <TodoList
              title="Personal Tasks"
              standardTodos={standardTodos}
              onOpenTodo={(key) => setSelectedTodoKey(key)}
            />
          </div>
        );
      case "priorities":
        return (
          <div className="content-section">
            <h1>Priorities</h1>
            <p>Manage the priorities which you can handout to your todos.</p>
            <PriorityList />
          </div>
        );
      case "tags":
        return (
          <div className="content-section">
            <h1>Tags</h1>
            <p>Organize your tasks with custom tags and categories.</p>
            <div className="placeholder-content">
              <h3>Tag Management</h3>
              <p>
                This section will contain tag creation, editing, and filtering
                features.
              </p>
            </div>
          </div>
        );
      case "user":
        return (
          <div className="content-section">
            <h1>User Profile</h1>
            <p>Manage your account settings and preferences.</p>
            <div className="placeholder-content">
              <h3>User Settings</h3>
              <p>
                This section will contain user profile management and settings.
              </p>
            </div>
          </div>
        );
      default:
        return selectedTodoKey ? (
          <div className="content-section">
            <EditTodo
              todoKey={selectedTodoKey}
              onBack={() => setSelectedTodoKey(null)}
            />
          </div>
        ) : (
          <div className="content-section">
            <h1>Todo App</h1>
            <p>
              Todo app where you can add, edit, complete, delete and filter
              todos
            </p>
            <TodoList
              title="Personal Tasks"
              standardTodos={standardTodos}
              onOpenTodo={(key) => setSelectedTodoKey(key)}
            />
          </div>
        );
    }
  };

  return (
    <div className="App">
      <MenuBar activeItem={activeMenuItem} onItemClick={handleMenuClick} />

      <div className="container">
        {renderContent()}

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
