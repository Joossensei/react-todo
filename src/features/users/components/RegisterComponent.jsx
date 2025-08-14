import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import StatusBanner from "../StatusBanner/StatusBanner";
import { userService } from "../../services/userService";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const RegisterComponent = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordChecks = useMemo(() => {
    const val = String(password || "");
    const lengthOk = val.length >= 8;
    const hasLower = /[a-z]/.test(val);
    const hasUpper = /[A-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSpecial = /[^A-Za-z0-9]/.test(val);
    return { lengthOk, hasLower, hasUpper, hasNumber, hasSpecial };
  }, [password]);

  function handleSubmit(event) {
    event.preventDefault();
    (async () => {
      setError("");
      if (!name || !username || !email || !password || !confirmPassword) {
        setError("Please fill in all fields.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      // Block submit if required password checks fail
      if (
        !passwordChecks.lengthOk ||
        !passwordChecks.hasLower ||
        !passwordChecks.hasUpper ||
        !passwordChecks.hasNumber
      ) {
        setError("Please meet the password requirements.");
        return;
      }

      try {
        setSubmitting(true);
        // 1) Register user
        await userService.register({
          name,
          username,
          email,
          password,
          is_active: true,
        });
        // 2) Auto-login
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
        // 3) Navigate to home
        navigate("/");
      } catch (e) {
        setError(e?.message || "Registration failed");
      } finally {
        setSubmitting(false);
      }
    })();
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">Create your account</h1>
        <p className="register-subtitle">Join TodoApp in seconds</p>

        {error && <StatusBanner type="error" message={error} />}

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label htmlFor="reg-name" className="form-label with-icon">
              <FaUser className="label-icon" /> Name
            </label>
            <input
              id="reg-name"
              type="text"
              className="text-input"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="reg-username" className="form-label with-icon">
              <FaUser className="label-icon" /> Username
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
            <label htmlFor="reg-email" className="form-label with-icon">
              <FaEnvelope className="label-icon" /> Email
            </label>
            <input
              id="reg-email"
              type="email"
              className="text-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="reg-password" className="form-label with-icon">
              <FaLock className="label-icon" /> Password
            </label>
            <div className="input-wrapper">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                className="text-input"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="toggle-visibility-btn"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="reg-confirm" className="form-label with-icon">
              <FaLock className="label-icon" /> Confirm password
            </label>
            <div className="input-wrapper">
              <input
                id="reg-confirm"
                type={showConfirmPassword ? "text" : "password"}
                className="text-input"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="toggle-visibility-btn"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                onClick={() => setShowConfirmPassword((v) => !v)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {password && (
            <div className="password-checker" aria-live="polite">
              <div className="checker-row">
                {passwordChecks.lengthOk ? (
                  <FaCheckCircle className="ok" />
                ) : (
                  <FaExclamationCircle className="warn" />
                )}
                <span>At least 8 characters</span>
              </div>
              <div className="checker-row">
                {passwordChecks.hasLower ? (
                  <FaCheckCircle className="ok" />
                ) : (
                  <FaExclamationCircle className="warn" />
                )}
                <span>Contains a lowercase letter</span>
              </div>
              <div className="checker-row">
                {passwordChecks.hasUpper ? (
                  <FaCheckCircle className="ok" />
                ) : (
                  <FaExclamationCircle className="warn" />
                )}
                <span>Contains an uppercase letter</span>
              </div>
              <div className="checker-row">
                {passwordChecks.hasNumber ? (
                  <FaCheckCircle className="ok" />
                ) : (
                  <FaExclamationCircle className="warn" />
                )}
                <span>Contains a number</span>
              </div>
              <div className="checker-row optional">
                {passwordChecks.hasSpecial ? (
                  <FaCheckCircle className="ok" />
                ) : (
                  <FaExclamationCircle className="warn" />
                )}
                <span>Bonus: add a special character</span>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="primary-btn register-btn"
              disabled={submitting}
            >
              {submitting ? "Creating…" : "Create account"}
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
