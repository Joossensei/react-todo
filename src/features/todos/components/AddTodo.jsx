import React, { useState, useRef, useEffect } from "react";
import "./styles/AddTodo.css";
import { validateTodo } from "../utils/todoUtils";
import { getPriorityIcon } from "../../../constants/priorityIcons";

const AddTodo = ({
  onAddTodo,
  isAddingTodo,
  setIsAddingTodo,
  newTodo,
  setNewTodo,
  priorities,
  prioritiesLoading,
  statuses,
  statusesLoading,
}) => {
  const [invalidAdd, setInvalidAdd] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const priorityDropdownRef = useRef(null);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef(null);

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
    setNewTodo({ ...newTodo, priority: priorityValue });
  };

  // Function to handle status selection
  const handleStatusSelect = (statusValue) => {
    setIsStatusDropdownOpen(false);
    setNewTodo({ ...newTodo, status: statusValue });
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
    return (
      <i
        className={status.icon}
        style={{
          color:
            status.color.charAt(0) === "#" && status.color.charAt(1) === "0"
              ? "white"
              : "black",
        }}
      />
    );
  };

  // Get current priority data
  const getCurrentPriority = (priorityValue) => {
    if (!priorityValue) return null;
    return priorities.find((p) => p.key === priorityValue);
  };

  // Get current status data
  const getCurrentStatus = (statusValue) => {
    if (!statusValue) return null;
    return statuses.find((s) => s.key === statusValue);
  };

  const handleAddTodo = () => {
    // Validate the todo input
    if (!validateTodo(newTodo.title) || newTodo.priority === "") {
      setInvalidAdd(true);
      return;
    }

    // If validation passes, clear the error and call the parent's onAddTodo
    setInvalidAdd(false);
    onAddTodo();
  };

  return (
    <>
      {/* Add todo button */}
      <div className="add-todo-btn-container">
        <button
          className="add-todo-btn"
          onClick={() => setIsAddingTodo(!isAddingTodo)}
        >
          Add Todo
        </button>
      </div>
      <div className="add-todo-input-container">
        <div className="add-todo-form-error-container">
          {invalidAdd && (
            <p id="invalid-add-text">Todo and priority are required</p>
          )}
        </div>
        {/* If the add button is clicked, show the input field to add a todo */}
        {isAddingTodo && (
          <div className="add-todo-form">
            <input
              className="add-todo-input"
              type="text"
              placeholder="Add a todo"
              value={newTodo.title}
              onChange={(e) =>
                setNewTodo({ ...newTodo, title: e.target.value })
              }
              onSubmit={handleAddTodo}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTodo();
                }
              }}
            ></input>
            <button className="add-todo-form-btn" onClick={handleAddTodo}>
              Add +
            </button>

            {/* Priority Dropdown */}
            <div className="add-todo-priority-field" ref={priorityDropdownRef}>
              <div
                className="add-todo-priority-selector"
                style={{
                  backgroundColor:
                    getCurrentPriority(newTodo.priority)?.color || "#e5e7eb",
                  borderRadius: isPriorityDropdownOpen ? "6px 6px 0 0" : "6px",
                  border: isPriorityDropdownOpen
                    ? "1px 1px 0 1px solid #e5e7eb"
                    : "1px solid #e5e7eb",
                  color:
                    getCurrentPriority(newTodo.priority)?.color.charAt(0) ===
                      "#" &&
                    getCurrentPriority(newTodo.priority)?.color.charAt(1) ===
                      "0"
                      ? "white"
                      : "black",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPriorityDropdownOpen(!isPriorityDropdownOpen);
                }}
              >
                <div className="add-todo-priority-icon">
                  {getCurrentPriority(newTodo.priority) ? (
                    getPriorityIconComponent(
                      getCurrentPriority(newTodo.priority),
                    )
                  ) : (
                    <span className="add-todo-priority-placeholder">
                      {prioritiesLoading ? "Loading..." : "Select Priority"}
                    </span>
                  )}
                </div>
                <span className="add-todo-priority-label">
                  {getCurrentPriority(newTodo.priority)?.name ||
                    (prioritiesLoading
                      ? "Loading priorities..."
                      : "Select Priority")}
                </span>
              </div>

              {isPriorityDropdownOpen && (
                <div
                  className="add-todo-priority-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  {priorities.map((priority) => (
                    <div
                      key={priority.key}
                      className="add-todo-priority-option"
                      style={{
                        backgroundColor: priority.color,
                        color:
                          priority.color.charAt(0) === "#" &&
                          priority.color.charAt(1) === "0"
                            ? "white"
                            : "black",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrioritySelect(priority.key);
                      }}
                    >
                      <div className="add-todo-priority-icon">
                        {getPriorityIconComponent(priority)}
                      </div>
                      <span className="add-todo-priority-label">
                        {priority.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Dropdown */}
            {statuses.length > 0 && (
              <div className="add-todo-status-field" ref={statusDropdownRef}>
                <div
                  className="add-todo-status-selector"
                  style={{
                    backgroundColor:
                      getCurrentStatus(newTodo.status)?.color || "#e5e7eb",
                    borderRadius: isStatusDropdownOpen ? "6px 6px 0 0" : "6px",
                    border: isStatusDropdownOpen
                      ? "1px 1px 0 1px solid #e5e7eb"
                      : "1px solid #e5e7eb",
                    color:
                      getCurrentStatus(newTodo.status)?.color.charAt(0) ===
                        "#" &&
                      getCurrentStatus(newTodo.status)?.color.charAt(1) === "0"
                        ? "white"
                        : "black",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsStatusDropdownOpen(!isStatusDropdownOpen);
                  }}
                >
                  <div className="add-todo-status-icon">
                    {getCurrentStatus(newTodo.status) ? (
                      getStatusIconComponent(getCurrentStatus(newTodo.status))
                    ) : (
                      <span className="add-todo-status-placeholder">
                        {statusesLoading ? "Loading..." : "Select Status"}
                      </span>
                    )}
                  </div>
                  <span className="add-todo-status-label">
                    {getCurrentStatus(newTodo.status)?.name ||
                      (statusesLoading
                        ? "Loading statuses..."
                        : "Select Status")}
                  </span>
                </div>

                {isStatusDropdownOpen && (
                  <div
                    className="add-todo-status-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {statuses.map((status) => (
                      <div
                        key={status.key}
                        className="add-todo-status-option"
                        style={{
                          backgroundColor: status.color,
                          color:
                            status.color.charAt(0) === "#" &&
                            status.color.charAt(1) === "0"
                              ? "white"
                              : "black",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusSelect(status.key);
                        }}
                      >
                        <div className="add-todo-status-icon">
                          {getStatusIconComponent(status)}
                        </div>
                        <span className="add-todo-status-label">
                          {status.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AddTodo;
