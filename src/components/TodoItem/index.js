import React from "react";
import "./TodoItem.css";

const TodoItem = ({ todo }) => {
  return (
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        readOnly
        className="todo-checkbox"
      />
      <span className="todo-text">{todo.text}</span>
      <div className="todo-actions">
        <button className="edit-btn">Edit</button>
        <button className="delete-btn">Delete</button>
      </div>
    </li>
  );
};

export default TodoItem;
