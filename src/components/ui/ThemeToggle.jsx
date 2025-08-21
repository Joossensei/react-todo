import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import "./styles/ThemeToggle.css";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme) {
      setIsDark(savedTheme === "dark");
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      setIsDark(systemPrefersDark);
      document.documentElement.setAttribute(
        "data-theme",
        systemPrefersDark ? "dark" : "light",
      );
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="theme-toggle-container">
      <button
        className={`theme-toggle ${isDark ? "dark" : "light"}`}
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <div className="toggle-track">
          <div className="toggle-slider">
            {isDark ? (
              <FaMoon className="toggle-icon moon-icon" />
            ) : (
              <FaSun className="toggle-icon sun-icon" />
            )}
          </div>
          <div className="toggle-labels">
            <span className="label day-label">LIGHT MODE</span>
            <span className="label night-label">DARK MODE</span>
          </div>
        </div>
      </button>
    </div>
  );
};

export default ThemeToggle;
