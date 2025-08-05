import React, { useState } from "react";
import "./AddTodo.css";
import {
  getPriorityByValue,
  getPriorityOrder,
} from "../../utils/priorityUtils";
import { validateTodo } from "../../utils/todoUtils";

const AddTodo = ({
  onAddTodo,
  isAddingTodo,
  setIsAddingTodo,
  newTodo,
  setNewTodo,
}) => {
  const [invalidAdd, setInvalidAdd] = useState(false);

  const handleAddTodo = () => {
    // Validate the todo input
    if (!validateTodo(newTodo.text) || newTodo.priority === "") {
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
              value={newTodo.text}
              onChange={(e) => setNewTodo({ ...newTodo, text: e.target.value })}
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
            <select
              className="add-todo-form-priority-select"
              value={newTodo.priority}
              onChange={(e) =>
                setNewTodo({ ...newTodo, priority: e.target.value })
              }
            >
              <option value="" disabled>
                Select Priority
              </option>
              {getPriorityOrder().map((priority) => (
                <option key={priority} value={priority}>
                  {getPriorityByValue(priority).label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </>
  );
};

export default AddTodo;
