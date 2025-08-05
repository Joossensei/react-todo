import React, { useState } from "react";
import "./TodoItem.css";

const TodoItem = ({ todo, toggleTodo, deleteTodo, editTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [invalidEdit, setInvalidEdit] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);

  const handleEdit = () => {
    console.log("Setting isEditing to true");
    setIsEditing(true);
    setInvalidEdit(false);
  };

  const handleSave = () => {
    if (editedText.trim() === "") {
      setInvalidEdit(true);
      return;
    } else {
      console.log("Setting isEditing to false");
      setInvalidEdit(false);
      setIsEditing(false);
      editTodo(todo.id, editedText);
    }
  };

  return (
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
        <div className="edit-form-container">
          <div className="edit-form-error-container">
            {invalidEdit && <p id="invalid-edit-text">Todo is required</p>}
          </div>
          {isEditing && (
            <div
              className="edit-form"
              style={{ marginTop: isEditing ? "10px" : "0px" }}
            >
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onBlur={() => setInvalidEdit(false)}
                onClick={() => setInvalidEdit(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSave();
                  }
                }}
              />
              <button onClick={handleSave}>Save</button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default TodoItem;
