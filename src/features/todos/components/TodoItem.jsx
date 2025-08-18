import React, { useState, useRef, useEffect } from "react";
import "./styles/TodoItem.css";
import { getPriorityByValue } from "../../priorities/utils/priorityUtils";
import { getPriorityIcon } from "../../../constants/priorityIcons";
import { useNavigate } from "react-router";

const TodoItem = ({
  todo,
  toggleTodo,
  deleteTodo,
  editTodo,
  priorities,
  onOpen,
}) => {
  // State for the priority dropdown
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const priorityDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(event.target)
      ) {
        setIsPriorityDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to handle priority selection
  const handlePrioritySelect = (priorityValue) => {
    setIsPriorityDropdownOpen(false);
    editTodo(todo.key, todo.title, priorityValue);
  };

  // Helper function to get priority icon component
  const getPriorityIconComponent = (priority) => {
    const IconComponent = getPriorityIcon(priority, priority?.icon);
    return (
      <IconComponent
        style={{
          color:
            priority.color.charAt(0) === "#" && priority.color.charAt(1) === "0"
              ? "white"
              : "black",
        }}
      />
    );
  };

  // Get current priority data
  const getCurrentPriority = (priorityValue) => {
    return getPriorityByValue(priorities, priorityValue);
  };

  const currentPriority = getCurrentPriority(todo.priority);
  const navigate = useNavigate();
  return (
    // If the todo is completed, add the completed class to the todo item
    <li
      className={`todo-item${todo.completed ? " completed" : ""}${isPriorityDropdownOpen ? " dropdown-open" : ""}`}
      onClick={() => navigate(`/todos/${todo.key}`)}
      style={{ cursor: onOpen ? "pointer" : "default" }}
    >
      <div className="todo-item-container-wrapper">
        <div className="todo-item-container">
          <input
            type="checkbox"
            checked={todo.completed}
            onClick={(e) => e.stopPropagation()}
            onChange={() => toggleTodo(todo.key)}
            className="todo-checkbox"
          />
          <span className="todo-text">{todo.title}</span>
        </div>
        <br />
        <div className="todo-item-priority-container" ref={priorityDropdownRef}>
          <div
            className="todo-item-priority"
            style={{
              backgroundColor: currentPriority?.color,
            }}
            // If we are editing the todo make the priority clickable for the user to change the priority
            onClick={(e) => {
              e.stopPropagation();
              setIsPriorityDropdownOpen(!isPriorityDropdownOpen);
            }}
          >
            <div className="todo-item-priority-icon">
              {getPriorityIconComponent(currentPriority)}
            </div>

            <span
              className="todo-item-priority-label"
              style={{
                // If the color of the priority is dark, make the text white
                color:
                  currentPriority.color.charAt(0) === "#" &&
                  currentPriority.color.charAt(1) === "0"
                    ? "white"
                    : "black",
              }}
            >
              {currentPriority?.name}
            </span>
          </div>
          {isPriorityDropdownOpen && (
            <div
              className="todo-item-priority-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              {priorities.map((priority) => (
                <div
                  key={priority.key}
                  className="todo-item-priority-option"
                  style={{
                    backgroundColor: priority.color,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrioritySelect(priority.key);
                  }}
                >
                  <div className="todo-item-priority-icon">
                    {getPriorityIconComponent(priority)}
                  </div>
                  <span
                    className="todo-item-priority-label"
                    style={{
                      // If the color of the priority is dark, make the text white
                      color:
                        priority.color.charAt(0) === "#" &&
                        priority.color.charAt(1) === "0"
                          ? "white"
                          : "black",
                    }}
                  >
                    {priority.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default TodoItem;
