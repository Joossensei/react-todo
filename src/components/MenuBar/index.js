import React from "react";
import "./MenuBar.css";

const MenuBar = ({ activeItem, onItemClick }) => {
  const menuItems = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "priorities", label: "Priorities", icon: "⭐" },
    { id: "tags", label: "Tags", icon: "🏷️" },
    { id: "user", label: "User", icon: "👤" },
  ];

  return (
    <nav className="menu-bar">
      <div className="menu-container">
        <div className="logo">
          <span className="logo-icon">📝</span>
          <span className="logo-text">TodoApp</span>
        </div>

        <ul className="menu-items">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`menu-item ${activeItem === item.id ? "active" : ""}`}
                onClick={() => onItemClick(item.id)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default MenuBar;
