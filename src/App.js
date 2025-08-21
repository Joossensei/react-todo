import React, { useEffect } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router";
import "./App.css";
import MenuBar from "./components/ui/MenuBar";
import { FaGithub, FaCode } from "react-icons/fa";
import { TodoList, EditTodo } from "./features/todos";
import { PriorityList, EditPriority } from "./features/priorities";
import { StatusList, EditStatus } from "./features/statuses";
import { LoginComponent, RegisterComponent, User } from "./features/users";
import { userService } from "./features/users/services/userService";

userService.installInterceptors({ loginPath: "/login" });

function App() {
  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute(
        "data-theme",
        systemPrefersDark ? "dark" : "light",
      );
    }
  }, []);

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
        <Route path="/statuses" element={<StatusList />} />
        <Route path="/statuses/new" element={<EditStatus />} />
        <Route path="/statuses/:key" element={<EditStatus />} />
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
