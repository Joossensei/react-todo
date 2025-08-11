import React, { useState } from "react";

const ForgotPassword = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (!emailOrUsername) return;
    // TODO: integrate forgot password endpoint
    setSubmitted(true);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Reset your password</h1>
        <p className="login-subtitle">Enter your email or username</p>

        {submitted ? (
          <div
            className="login-error"
            style={{
              color: "#065f46",
              background: "#ecfdf5",
              borderColor: "#a7f3d0",
            }}
          >
            If an account exists, a reset link has been sent.
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <label htmlFor="identifier" className="form-label">
                Email or Username
              </label>
              <input
                id="identifier"
                type="text"
                className="text-input"
                placeholder="you@example.com or username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn login-btn">
                Send reset link
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
