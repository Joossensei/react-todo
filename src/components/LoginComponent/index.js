import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import StatusBanner from "../StatusBanner";
import { userService } from "../../services/userService";
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      await userService.loginRaw({
        data: {
          grant_type: "password",
          username: username,
          password: password,
          scope: "todos,priorities",
          client_id: "todoapp",
          client_secret: "todoapp",
        },
        contentType: "application/x-www-form-urlencoded",
      });
      navigate("/");
    } catch (e) {
      setError(e?.message || "Login failed. Please try again.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to continue to TodoApp</p>

        {error && <StatusBanner type="error" message={error} />}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="text-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="text-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn login-btn">
              Log in
            </button>
          </div>
        </form>

        <div className="auth-links">
          <p className="auth-text">
            No account?{" "}
            <Link to="/register" className="auth-link">
              Click here to register
            </Link>
          </p>
          <p className="auth-text">
            <Link to="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
