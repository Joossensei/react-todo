import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import "./App.css";
import TodoList from "./components/TodoList";
import MenuBar from "./components/MenuBar";
import { FaGithub, FaCode } from "react-icons/fa";
import PriorityList from "./components/PriorityList";
import EditTodo from "./components/EditTodo";
import EditPriority from "./components/EditPriority";
import LoginComponent from "./components/LoginComponent";
import RegisterComponent from "./components/RegisterComponent";
import ForgotPassword from "./components/ForgotPassword";
import { userService } from "./services/userService";

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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/user" element={<div>User...</div>} />
        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
