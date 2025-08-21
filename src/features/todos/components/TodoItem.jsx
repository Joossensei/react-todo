import React, { useState, useRef, useEffect } from "react";
import "./styles/TodoItem.css";
import { getPriorityByValue } from "../../priorities/utils/priorityUtils";
import {
  getIconComponent,
  getPriorityIcon,
} from "../../../constants/priorityIcons";
import { useStatuses } from "../../statuses/hooks/useStatuses";
import { useNavigate } from "react-router";
import { FaTrash } from "react-icons/fa";

const TodoItem = ({
  todo,
  toggleTodo,
  deleteTodo,
  editTodo,
  priorities,
  onOpen,
}) => {
  const { statuses } = useStatuses();

  // State for the priority dropdown
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const priorityDropdownRef = useRef(null);

  // State for the status dropdown
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef(null);

  // Swipe-to-delete functionality
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const todoItemRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(event.target)
      ) {
        setIsPriorityDropdownOpen(false);
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setIsStatusDropdownOpen(false);
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
    editTodo(todo.key, todo.title, priorityValue, todo.status);
  };

  // Function to handle status selection
  const handleStatusSelect = (statusValue) => {
    setIsStatusDropdownOpen(false);
    editTodo(todo.key, todo.title, todo.priority, statusValue);
  };

  // Swipe-to-delete handlers (touch and mouse)
  const handleDragStart = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setCurrentX(clientX);
    setIsSwiping(true);
    setHasDragged(false);

    // Prevent text selection during swipe
    e.preventDefault();
  };

  const handleDragMove = (e) => {
    if (!isSwiping) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const newX = clientX;
    const distance = startX - newX;

    // Only allow left swipe (positive distance)
    if (distance > 0) {
      setSwipeDistance(Math.min(distance, 100)); // Max 100px swipe
      setCurrentX(newX);
      setHasDragged(true);
      // Prevent text selection and scrolling during swipe
      e.preventDefault();
    }
  };

  const handleDragEnd = (e) => {
    if (!isSwiping) return;

    setIsSwiping(false);

    // If swiped more than 50px, trigger delete
    if (swipeDistance > 50) {
      deleteTodo(todo.key);
    }

    // Reset swipe state
    setSwipeDistance(0);
    setStartX(0);
    setCurrentX(0);
  };

  // Touch event handlers
  const handleTouchStart = handleDragStart;
  const handleTouchMove = handleDragMove;
  const handleTouchEnd = handleDragEnd;

  // Mouse event handlers for desktop
  const handleMouseDown = (e) => {
    // Only handle left mouse button
    if (e.button !== 0) return;
    handleDragStart(e);
  };

  const handleMouseMove = (e) => {
    if (!isSwiping) return;
    handleDragMove(e);
  };

  const handleMouseUp = (e) => {
    if (!isSwiping) return;
    handleDragEnd(e);
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

  // Helper function to get status icon component
  const getStatusIconComponent = (status) => {
    if (!status) return <div></div>;
    return getIconComponent(
      status.icon,
      status.color.charAt(0) === "#" && status.color.charAt(1) === "0"
        ? "white"
        : "black",
    );
  };

  // Get current priority data
  const getCurrentPriority = (priorityValue) => {
    return getPriorityByValue(priorities, priorityValue);
  };

  // Get current status data
  const getCurrentStatus = (statusValue) => {
    return statuses.find((status) => status.key === statusValue);
  };

  const currentPriority = getCurrentPriority(todo.priority);
  const currentStatus = getCurrentStatus(todo.status);
  const navigate = useNavigate();

  // Handle click with swipe detection
  const handleClick = (e) => {
    // If we just dragged or swiped, don't navigate
    if (hasDragged || swipeDistance > 10) {
      e.preventDefault();
      e.stopPropagation();
      // Reset the drag flag after a short delay
      setTimeout(() => setHasDragged(false), 100);
      return;
    }
    navigate(`/todos/${todo.key}`);
  };

  // Add global mouse event listeners for drag
  useEffect(() => {
    if (isSwiping) {
      const handleGlobalMouseMove = (e) => {
        handleMouseMove(e);
      };

      const handleGlobalMouseUp = (e) => {
        handleMouseUp(e);
      };

      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isSwiping, swipeDistance, startX]);

  return (
    // If the todo is completed, add the completed class to the todo item
    <li
      ref={todoItemRef}
      className={`todo-item${todo.completed ? " completed" : ""}${isPriorityDropdownOpen || isStatusDropdownOpen ? " dropdown-open" : ""}${isSwiping ? " swiping" : ""}`}
      onClick={handleClick}
      style={{
        cursor: onOpen ? "pointer" : "default",
        transform: `translateX(-${swipeDistance}px)`,
        transition: isSwiping ? "none" : "transform 0.3s ease",
        userSelect: isSwiping ? "none" : "auto",
        position: "relative",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      {/* Trash can icon that appears when swiping */}
      {swipeDistance > 20 && (
        <div className="todo-item-trash-icon">
          <FaTrash />
        </div>
      )}
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
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {/* Priority Dropdown */}
          <div
            className="todo-item-priority-container"
            ref={priorityDropdownRef}
          >
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
          {/* Status Dropdown */}
          <div className="todo-item-status-container" ref={statusDropdownRef}>
            <div
              className={`todo-item-status ${!currentStatus ? "todo-item-status-placeholder" : ""}`}
              style={{
                backgroundColor: currentStatus?.color || "var(--border-color)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsStatusDropdownOpen(!isStatusDropdownOpen);
              }}
            >
              <div className="todo-item-status-icon">
                {getStatusIconComponent(currentStatus)}
              </div>

              <span
                className="todo-item-status-label"
                style={{
                  color: !currentStatus
                    ? "var(--text-secondary)"
                    : currentStatus?.color.charAt(0) === "#" &&
                        currentStatus?.color.charAt(1) === "0"
                      ? "white"
                      : "black",
                }}
              >
                {currentStatus?.name || "Select a status"}
              </span>
            </div>
            {isStatusDropdownOpen && (
              <div
                className="todo-item-status-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                {statuses.map((status) => (
                  <div
                    key={status.key}
                    className="todo-item-status-option"
                    style={{
                      backgroundColor: status.color,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusSelect(status.key);
                    }}
                  >
                    <div className="todo-item-status-icon">
                      {getStatusIconComponent(status)}
                    </div>
                    <span
                      className="todo-item-status-label"
                      style={{
                        color:
                          status.color.charAt(0) === "#" &&
                          status.color.charAt(1) === "0"
                            ? "white"
                            : "black",
                      }}
                    >
                      {status.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default TodoItem;
