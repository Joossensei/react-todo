import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router";
import "./App.css";
import MenuBar from "./components/ui/MenuBar";
import { FaGithub, FaCode } from "react-icons/fa";
import { TodoList, EditTodo } from "./features/todos";
import { PriorityList, EditPriority } from "./features/priorities";
import { LoginComponent, RegisterComponent, User } from "./features/users";
import { userService } from "./features/users/services/userService";

userService.installInterceptors({ loginPath: "/login" });

function App() {
  function AppLayout() {
    return (
      <div className="App">
        <MenuBar />

        <div className="container">
          <Outlet />

          <footer>
            <p>
              <a href="https://github.com/Joossensei">
                <FaGithub />
              </a>
              <span> & </span>
              <a href="https://cursor.com">
                <FaCode />
              </a>
            </p>
            <p>
              Made by <a href="https://github.com/Joossensei">Joost Both</a> &{" "}
              <a href="https://cursor.com">Cursor</a>
            </p>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<TodoList title="Personal Tasks" />} />
        <Route path="/todos/:id" element={<EditTodo />} />
        <Route path="/priorities" element={<PriorityList />} />
        <Route path="/priorities/new" element={<EditPriority />} />
        <Route path="/priorities/:id" element={<EditPriority />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/user" element={<User />} />
        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
