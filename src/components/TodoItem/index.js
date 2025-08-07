import React, { useState, useRef, useEffect } from "react";
import "./TodoItem.css";
import { validateTodo } from "../../utils/todoUtils";
import { getPriorityByValue } from "../../utils/priorityUtils";
import { getPriorityIcon } from "../../constants/priorityIcons";

const TodoItem = ({ todo, toggleTodo, deleteTodo, editTodo, priorities }) => {
  // States for editing a todo
  const [isEditing, setIsEditing] = useState(false);
  const [invalidEdit, setInvalidEdit] = useState(false);
  // State for the edited text
  const [editedText, setEditedText] = useState(todo.text);
  // State for the edited priority
  const [newPriority, setNewPriority] = useState(todo.priority);
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

  // Function to edit a todo
  const handleEdit = () => {
    setIsEditing(!isEditing);
    setIsPriorityDropdownOpen(false);
    setNewPriority(todo.priority);
    setInvalidEdit(false);
  };

  // Function to save the edited todo
  const handleSave = () => {
    // If the edited text is empty, set the invalid edit state to true
    if (!validateTodo(editedText)) {
      setInvalidEdit(true);
      return; // Return to prevent the function from continuing
    } else {
      // If the edited text is not empty, set the invalid edit state to false and edit the todo
      setInvalidEdit(false);
      setIsEditing(false);
      setIsPriorityDropdownOpen(false);
      editTodo(todo.id, editedText, newPriority);
    }
  };

  // Function to handle priority selection
  const handlePrioritySelect = (priorityValue) => {
    setNewPriority(priorityValue);
    setIsPriorityDropdownOpen(false);
    editTodo(todo.id, todo.text, priorityValue);
  };

  // Helper function to get priority icon component
  const getPriorityIconComponent = (priority) => {
    const IconComponent = getPriorityIcon(priority, priority?.icon);
    return <IconComponent />;
  };

  // Get current priority data
  const getCurrentPriority = (priorityValue) => {
    return getPriorityByValue(priorities, priorityValue);
  };

  const currentPriority = getCurrentPriority(
    isEditing ? newPriority : todo.priority,
  );

  return (
    // If the todo is completed, add the completed class to the todo item
    <li
      className={`todo-item ${todo.completed ? "completed" : ""} ${isPriorityDropdownOpen ? "dropdown-open" : ""}`}
    >
      <div className="todo-item-container-wrapper">
        <div className="todo-item-container">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
            className="todo-checkbox"
          />
          <span className="todo-text">{todo.text}</span>
          <div className="todo-actions">
            <button className="edit-btn" onClick={() => handleEdit()}>
              Edit
            </button>
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </div>
        </div>
        {/* Reason for not using a form is because the form would submit and refresh the page which makes the edit form dissapear */}
        <div className="edit-form-container">
          {/* If the edited text is empty, show a message */}
          <div className="edit-form-error-container">
            {invalidEdit && <p id="invalid-edit-text">Todo is required</p>}
          </div>
          {/* If the todo is being edited, show the edit form */}
          {isEditing && (
            <div
              className="edit-form"
              style={{
                marginTop: isEditing ? "10px" : "0px",
                marginBottom: isEditing ? "10px" : "0px",
              }}
            >
              <input
                type="text"
                placeholder="Edit todo"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onClick={() => setInvalidEdit(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSave();
                  }
                }}
              />
              {/* If the edited text is not empty, show the save button */}
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setIsEditing(false);
                  setIsPriorityDropdownOpen(false);
                  setNewPriority(todo.priority);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="todo-item-priority-container" ref={priorityDropdownRef}>
          <div
            className="todo-item-priority"
            style={{
              backgroundColor: currentPriority?.color,
            }}
            // If we are editing the todo make the priority clickable for the user to change the priority
            onClick={() => {
              setIsPriorityDropdownOpen(!isPriorityDropdownOpen);
            }}
          >
            <div className="todo-item-priority-icon">
              {getPriorityIconComponent(currentPriority)}
            </div>
            <span className="todo-item-priority-label">
              {currentPriority?.name}
            </span>
          </div>
          {isPriorityDropdownOpen && (
            <div className="todo-item-priority-dropdown">
              {priorities.map((priority) => (
                <div
                  key={priority.key}
                  className="todo-item-priority-option"
                  style={{
                    backgroundColor: priority.color,
                  }}
                  onClick={() => handlePrioritySelect(priority.key)}
                >
                  <div className="todo-item-priority-icon">
                    {getPriorityIconComponent(priority)}
                  </div>
                  <span className="todo-item-priority-label">
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
