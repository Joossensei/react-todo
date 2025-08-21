import React, { useEffect, useMemo, useRef, useState } from "react";
import "./styles/User.css";
import { userService } from "../services/userService";
import StatusBanner from "../../../components/ui/StatusBanner";
import { useStores } from "../../../stores/RootStoreContext";
import { observer } from "mobx-react-lite";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaClock,
  FaEdit,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const User = observer(() => {
  const { userStore, userListStore } = useStores();
  const {
    user,
    loading: userLoading,
    error: userError,
    fetchUser: fetchCurrentUser,
    updateUser,
  } = userStore;
  const {
    users: usersList,
    loading: usersListLoading,
    error: usersListError,
    fetchUsers: fetchUsersList,
  } = userListStore;

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [changeError, setChangeError] = useState("");
  const [changeSuccess, setChangeSuccess] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPasswordField, setShowConfirmPasswordField] =
    useState(false);
  const newPasswordChecks = useMemo(() => {
    const val = String(newPassword || "");
    const lengthOk = val.length >= 8;
    const hasLower = /[a-z]/.test(val);
    const hasUpper = /[A-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSpecial = /[^A-Za-z0-9]/.test(val);
    return { lengthOk, hasLower, hasUpper, hasNumber, hasSpecial };
  }, [newPassword]);

  // Inline edit state
  const [editingField, setEditingField] = useState(null); // 'name' | 'email' | null
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef(null);
  const [savingInline, setSavingInline] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }
  const toastTimerRef = useRef(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2000);
  }

  useEffect(() => {
    async function load() {
      await fetchCurrentUser();
      await fetchUsersList();
    }
    load();
  }, [fetchCurrentUser, fetchUsersList]);

  const otherUsers = useMemo(() => {
    if (!user || !usersList) return [];
    return usersList.filter((u) => {
      return u.key !== user.key;
    });
  }, [usersList, user]);

  const nameValue = useMemo(() => {
    if (!user) return "";
    return user.name || "";
  }, [user]);

  const isValidEmail = (value) => {
    const email = String(value || "").trim();
    // Simple RFC5322-inspired check, good enough for client-side UX
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  };

  async function handleChangePassword(e) {
    e.preventDefault();
    setChangeError("");
    setChangeSuccess("");
    if (!oldPassword || !newPassword) {
      setChangeError("Please fill in all fields.");
      return;
    }
    if (
      !newPasswordChecks.lengthOk ||
      !newPasswordChecks.hasLower ||
      !newPasswordChecks.hasUpper ||
      !newPasswordChecks.hasNumber
    ) {
      setChangeError("Please meet the password requirements.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangeError("New passwords do not match.");
      return;
    }
    try {
      setChanging(true);
      await userService.updatePassword({
        oldPassword,
        newPassword,
      });
      setChangeSuccess("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePassword(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data?.message;
      setChangeError(apiMsg || e?.message || "Failed to update password");
    } finally {
      setChanging(false);
    }
  }

  function handleLogout() {
    userService.logout({ redirectTo: "/login" });
  }

  async function handleSaveInline(field, value) {
    if (!user) return;
    const trimmed = String(value || "").trim();
    if (savingInline) return;
    if (!trimmed) {
      setEditingField(null);
      showToast("Value cannot be empty", "error");
      return;
    }
    if (field === "email" && !isValidEmail(trimmed)) {
      showToast("Enter a valid email", "error");
      return;
    }
    const currentVal = String(user?.[field] || "").trim();
    if (trimmed === currentVal) {
      setEditingField(null);
      return;
    }
    try {
      setSavingInline(true);
      const updates = { [field]: trimmed };
      await updateUser(updates);
      await fetchCurrentUser();
      setEditingField(null);
      showToast("Saved", "success");
    } catch (e) {
      // Surface error in banner
      // setUserError(
      //   e?.response?.data?.detail || e?.message || "Failed to update user",
      // );
      setEditingField(null);
      showToast("Failed to save", "error");
    } finally {
      setSavingInline(false);
    }
  }

  function formatDate(value) {
    if (!value) return "—";
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return String(value);
      return d.toLocaleString();
    } catch (_e) {
      return String(value);
    }
  }

  return (
    <div className="user-page">
      <div className="user-card">
        <button className="danger-btn logout-btn" onClick={handleLogout}>
          Logout
        </button>

        <div
          className={`user-status ${user?.is_active ? "active" : "inactive"}`}
        >
          <span className={`status-dot ${user?.is_active ? "on" : "off"}`} />
          {user?.is_active ? "Active" : "Inactive"}
        </div>

        <h1 className="user-title">Your account</h1>
        <p className="user-subtitle">Manage your profile and security</p>

        {userLoading ? (
          <StatusBanner type="loading">Loading your data…</StatusBanner>
        ) : userError ? (
          <StatusBanner type="error">{userError}</StatusBanner>
        ) : (
          <>
            <div className="user-info">
              <div className="info-row">
                <div className="info-label with-icon">
                  <FaUser className="label-icon" /> Username
                </div>
                <div className="info-value">
                  <span className="inline-text">{user?.username || "—"}</span>
                  <span
                    className="field-trailing-icon locked"
                    aria-hidden="true"
                  >
                    <FaLock />
                  </span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-label with-icon">
                  <FaUser className="label-icon" /> Name
                </div>
                <div
                  className={`info-value ${editingField === "name" ? "editing" : ""}`}
                  onDoubleClick={() => {
                    setEditingField("name");
                    setEditValue(nameValue);
                    setTimeout(() => inputRef.current?.focus(), 0);
                  }}
                >
                  {editingField === "name" ? (
                    <input
                      ref={inputRef}
                      className="text-input inline-input"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={async () => {
                        await handleSaveInline("name", editValue);
                      }}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          await handleSaveInline("name", editValue);
                        } else if (e.key === "Escape") {
                          setEditingField(null);
                        }
                      }}
                    />
                  ) : (
                    <span className="inline-text">{nameValue || "—"}</span>
                  )}
                  {editingField !== "name" && (
                    <span
                      className="field-trailing-icon editable"
                      aria-hidden="true"
                    >
                      <FaEdit />
                    </span>
                  )}
                </div>
              </div>

              <div className="info-row">
                <div className="info-label with-icon">
                  <FaEnvelope className="label-icon" /> Email
                </div>
                <div
                  className={`info-value ${editingField === "email" ? "editing" : ""}`}
                  onDoubleClick={() => {
                    setEditingField("email");
                    setEditValue(user?.email || "");
                    setTimeout(() => inputRef.current?.focus(), 0);
                  }}
                >
                  {editingField === "email" ? (
                    <input
                      ref={inputRef}
                      className="text-input inline-input"
                      type="email"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={async () => {
                        await handleSaveInline("email", editValue);
                      }}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          await handleSaveInline("email", editValue);
                        } else if (e.key === "Escape") {
                          setEditingField(null);
                        }
                      }}
                    />
                  ) : (
                    <span className="inline-text">{user?.email || "—"}</span>
                  )}
                  {editingField !== "email" && (
                    <span
                      className="field-trailing-icon editable"
                      aria-hidden="true"
                    >
                      <FaEdit />
                    </span>
                  )}
                </div>
              </div>

              <div className="info-row">
                <div className="info-label with-icon">
                  <FaCalendarAlt className="label-icon" /> Created
                </div>
                <div className="info-value">
                  <span className="inline-text">
                    {formatDate(user?.created_at)}
                  </span>
                </div>
              </div>

              {user?.updated_at && (
                <div className="info-row">
                  <div className="info-label with-icon">
                    <FaClock className="label-icon" /> Updated
                  </div>
                  <div className="info-value">
                    <span className="inline-text">
                      {formatDate(user?.updated_at)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="user-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={() => setShowChangePassword((v) => !v)}
              >
                {showChangePassword ? "Cancel" : "Change password"}
              </button>
            </div>

            {showChangePassword && (
              <form
                className="user-form"
                onSubmit={handleChangePassword}
                noValidate
              >
                {changeError && (
                  <div className="user-banner error">{changeError}</div>
                )}
                {changeSuccess && (
                  <div className="user-banner success">{changeSuccess}</div>
                )}

                <div className="form-row">
                  <label htmlFor="oldPassword" className="form-label with-icon">
                    <FaLock className="label-icon" /> Current password
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="oldPassword"
                      type={showOldPassword ? "text" : "password"}
                      className="text-input"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="toggle-visibility-btn"
                      aria-label={
                        showOldPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowOldPassword((v) => !v)}
                    >
                      {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="form-row">
                  <label htmlFor="newPassword" className="form-label with-icon">
                    <FaLock className="label-icon" /> New password
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      className="text-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="toggle-visibility-btn"
                      aria-label={
                        showNewPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowNewPassword((v) => !v)}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {newPassword && (
                  <div className="password-checker" aria-live="polite">
                    <div className="checker-row">
                      {newPasswordChecks.lengthOk ? (
                        <FaCheckCircle className="ok" />
                      ) : (
                        <FaExclamationTriangle className="required" />
                      )}
                      <span>At least 8 characters</span>
                    </div>
                    <div className="checker-row">
                      {newPasswordChecks.hasLower ? (
                        <FaCheckCircle className="ok" />
                      ) : (
                        <FaExclamationTriangle className="required" />
                      )}
                      <span>Contains a lowercase letter</span>
                    </div>
                    <div className="checker-row">
                      {newPasswordChecks.hasUpper ? (
                        <FaCheckCircle className="ok" />
                      ) : (
                        <FaExclamationTriangle className="required" />
                      )}
                      <span>Contains an uppercase letter</span>
                    </div>
                    <div className="checker-row">
                      {newPasswordChecks.hasNumber ? (
                        <FaCheckCircle className="ok" />
                      ) : (
                        <FaExclamationTriangle className="required" />
                      )}
                      <span>Contains a number</span>
                    </div>
                    <div className="checker-row optional">
                      {newPasswordChecks.hasSpecial ? (
                        <FaCheckCircle className="ok" />
                      ) : (
                        <FaExclamationCircle className="warn" />
                      )}
                      <span>Bonus: add a special character</span>
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <label
                    htmlFor="confirmPassword"
                    className="form-label with-icon"
                  >
                    <FaLock className="label-icon" /> Confirm new password
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="confirmPassword"
                      type={showConfirmPasswordField ? "text" : "password"}
                      className="text-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="toggle-visibility-btn"
                      aria-label={
                        showConfirmPasswordField
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() => setShowConfirmPasswordField((v) => !v)}
                    >
                      {showConfirmPasswordField ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="primary-btn"
                    disabled={changing}
                  >
                    {changing ? "Updating…" : "Update password"}
                  </button>
                </div>
              </form>
            )}

            <div className="user-list">
              <h2 className="section-title">Other users</h2>
              {usersListLoading ? (
                <StatusBanner type="loading">Loading users…</StatusBanner>
              ) : usersListError ? (
                <StatusBanner type="error">{usersListError}</StatusBanner>
              ) : (
                <>
                  {otherUsers.length === 0 ? (
                    <p className="muted">No other users found.</p>
                  ) : (
                    <ul className="users">
                      {otherUsers.map((u) => (
                        <li
                          key={u.id ?? u.key ?? u.username}
                          className="user-list-item"
                        >
                          <span className="user-badge">
                            {(u.username || "?").slice(0, 2).toUpperCase()}
                          </span>
                          <div className="user-list-text">
                            <div className="user-list-name">
                              {u.username || "Unknown"}
                            </div>
                            <div className="user-list-sub">
                              {u.email || (u.id ?? u.key)}
                            </div>
                          </div>
                          <div
                            className={`user-status user-list-status ${u?.is_active ? "active" : "inactive"}`}
                            title={u?.is_active ? "Active" : "Inactive"}
                          >
                            <span
                              className={`status-dot ${u?.is_active ? "on" : "off"}`}
                            />
                            {u?.is_active ? "Active" : "Inactive"}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </>
        )}
        {toast && (
          <div className={`user-toast ${toast.type}`}>
            {toast.type === "success" ? (
              <FaCheckCircle className="toast-icon" />
            ) : (
              <FaExclamationCircle className="toast-icon" />
            )}
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default User;
