import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

const RegisterComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!username || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // TODO: integrate registration endpoint
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">Create your account</h1>
        <p className="register-subtitle">Join TodoApp in seconds</p>

        {error && (
          <div className="register-error" role="alert">
            {error}
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label htmlFor="reg-username" className="form-label">
              Username
            </label>
            <input
              id="reg-username"
              type="text"
              className="text-input"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="reg-password" className="form-label">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              className="text-input"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="reg-confirm" className="form-label">
              Confirm password
            </label>
            <input
              id="reg-confirm"
              type="password"
              className="text-input"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn register-btn">
              Create account
            </button>
          </div>
        </form>

        <p className="auth-text" style={{ marginTop: 12 }}>
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterComponent;
