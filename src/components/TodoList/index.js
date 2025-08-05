import React, { useState } from "react";
import "./TodoList.css";
import TodoItem from "../TodoItem";

// Create the TodoList component
const TodoList = (props) => {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Build Todo App", completed: true },
    { id: 3, text: "Write Tests", completed: false },
  ]);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [filter, setFilter] = useState("all");
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [invalidAdd, setInvalidAdd] = useState(false);

  // Function to toggle the completed status of a todo
  const toggleTodo = (id) => {
    setTodos(
      todos.map(
        (todo) =>
          todo.id === id
            ? { ...todo, completed: !todo.completed } // Toggle completed status
            : todo, // Keep other todos unchanged
      ),
    );
  };

  // Function to delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleEditTodo = (id, text) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text } : todo)));
  };

  const handleAddTodo = () => {
    if (newTodo.trim() === "") {
      setInvalidAdd(true);
      return;
    } else {
      setInvalidAdd(false);
    }
    setIsAddingTodo(false);
    setTodos([
      ...todos,
      {
        id: todos.length + 1,
        text: newTodo,
        completed: false,
      },
    ]);
    setNewTodo("");
  };

  const handleChangeFilter = (e) => {
    setFilter(e.target.value);
    setIsFiltering(true);
    if (e.target.value === "completed") {
      setFilteredTodos(todos.filter((todo) => todo.completed));
    } else if (e.target.value === "incomplete") {
      setFilteredTodos(todos.filter((todo) => !todo.completed));
    } else {
      setTodos(todos);
      setFilteredTodos([]);
      setIsFiltering(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);

    if (e.target.value === "") {
      setTodos(todos);
      setFilteredTodos([]);
      setIsFiltering(false);
    } else {
      setIsFiltering(true);
      setFilteredTodos(
        todos.filter((todo) =>
          todo.text.toLowerCase().includes(e.target.value.toLowerCase()),
        ),
      );
    }
  };

  return (
    <div className="todo-list-container">
      <h1>{props.title}</h1>
      <div className="todo-list-header">
        {/* Search bar */}
        <input
          id="searchTodos"
          type="text"
          placeholder="Search todos"
          className="search-bar"
          value={search}
          onChange={handleSearch}
        />
        {/* Filter by completed status */}
        <select
          id="filterTodos"
          className="filter-select"
          value={filter}
          onChange={handleChangeFilter}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
        {/* Add todo button */}
        <button
          className="add-todo-btn"
          onClick={() => setIsAddingTodo(!isAddingTodo)}
        >
          Add Todo
        </button>
      </div>
      <div className="add-todo-input-container">
        <div className="add-todo-form-error-container">
          {invalidAdd && <p id="invalid-add-text">Todo is required</p>}
        </div>
        {/* If the add button is clicked, show the input field to add a todo */}
        {isAddingTodo && (
          <div className="add-todo-form">
            <input
              className="add-todo-input"
              type="text"
              placeholder="Add a todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onSubmit={handleAddTodo}
            ></input>
            <button className="add-todo-form-btn" onClick={handleAddTodo}>
              Add +
            </button>
          </div>
        )}
      </div>
      <ul className="todo-list">
        {/* Map through the todoList array and render a TodoItem component for each todo */}
        {/* Key prop is used to help React keep track of which items have changed */}
        {todos.length === 0 && filteredTodos.length === 0 && (
          <p>No todos to show</p>
        )}
        {filteredTodos.length > 0 &&
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              editTodo={handleEditTodo}
            />
          ))}
        {todos.length > 0 &&
          filteredTodos.length === 0 &&
          !isFiltering &&
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              editTodo={handleEditTodo}
            />
          ))}
        {filteredTodos.length === 0 && isFiltering && <p>No todos found</p>}
      </ul>
    </div>
  );
};

export default TodoList;
