import React, { useState } from "react";
import "./TodoItem.css";
import { validateTodo } from "../../utils/todoUtils";

const TodoItem = ({ todo, toggleTodo, deleteTodo, editTodo }) => {
  // States for editing a todo
  const [isEditing, setIsEditing] = useState(false);
  const [invalidEdit, setInvalidEdit] = useState(false);
  // State for the edited text
  const [editedText, setEditedText] = useState(todo.text);

  // Function to edit a todo
  const handleEdit = () => {
    setIsEditing(!isEditing);
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
      editTodo(todo.id, editedText);
    }
  };

  return (
    // If the todo is completed, add the completed class to the todo item
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
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
              style={{ marginTop: isEditing ? "10px" : "0px" }}
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
              <button onClick={handleSave}>Save</button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default TodoItem;
