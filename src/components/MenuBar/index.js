import React from "react";
import "./MenuBar.css";
import { Link, useLocation } from "react-router";
import { FaUser } from "react-icons/fa";
import { BsIncognito } from "react-icons/bs";
import { userService } from "../../services/userService";

const MenuBar = () => {
  const location = useLocation();
  const menuItems = [
    { id: "home", label: "Home", icon: "🏠", to: "/" },
    { id: "priorities", label: "Priorities", icon: "⭐", to: "/priorities" },
    { id: "user", label: "", icon: "👤", to: "/user" },
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
              <Link
                to={item.to}
                className={`menu-item ${location.pathname === item.to ? "active" : ""}`}
              >
                {item.id === "user" && (
                  <>
                    {userService.getUserKey() !== null && (
                      <span className="menu-icon">
                        <FaUser />
                      </span>
                    )}
                    {userService.getUserKey() === null && (
                      <span className="menu-icon">
                        <BsIncognito />
                      </span>
                    )}
                  </>
                )}
                {item.id !== "user" && (
                  <span className="menu-icon">{item.icon}</span>
                )}
                {item.label.length > 0 && (
                  <span className="menu-label">{item.label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default MenuBar;
