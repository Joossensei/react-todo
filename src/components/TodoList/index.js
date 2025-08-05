import React, { useState } from "react";
import "./TodoList.css";
import TodoItem from "../TodoItem";

// Create the TodoList component
const TodoList = (props) => {
  // States for the todos
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Build Todo App", completed: true },
    { id: 3, text: "Write Tests", completed: false },
  ]);
  // States for adding a todo
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  // States for filtering the todos
  const [isFiltering, setIsFiltering] = useState(false);
  const [filter, setFilter] = useState("all");
  const [filteredTodos, setFilteredTodos] = useState([]); // Array to store the filtered todos
  // States for searching for a todo
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

  // Function to edit a todo (used in TodoItem component)
  const handleEditTodo = (id, text) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text } : todo)));
  };

  // Function to add a todo
  const handleAddTodo = () => {
    // If the todo is empty, set the invalid add state to true
    if (newTodo.trim() === "") {
      setInvalidAdd(true);
      return;
    }
    // If the todo is not empty, set the invalid add state to false
    setInvalidAdd(false);
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

  // Function to filter the todos by completed status
  const handleChangeFilter = (e) => {
    setFilter(e.target.value);
    setIsFiltering(true);
    // If the filter value is completed, filter the todos by completed status
    if (e.target.value === "completed") {
      setFilteredTodos(todos.filter((todo) => todo.completed));
    }
    // If the filter value is incomplete, filter the todos by incomplete status
    else if (e.target.value === "incomplete") {
      setFilteredTodos(todos.filter((todo) => !todo.completed));
    }
    // If the filter value is all, show all todos
    else {
      setTodos(todos);
      setFilteredTodos([]);
      setIsFiltering(false);
    }
  };

  // Function to search for a todo
  const handleSearch = (e) => {
    // Set the search value to the input value
    setSearch(e.target.value);

    // If the search value is empty, show all todos
    if (e.target.value === "") {
      setTodos(todos);
      setFilteredTodos([]);
      setIsFiltering(false);
    } else {
      // If the search value is not empty, filter the todos
      setIsFiltering(true);
      // Filter the todos by the lowercase version of the search value so it's case insensitive
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
        {/* Check if there are filtered todos or todos and if there are none to show, show a message */}
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
        {/* If there are no filtered todos and the filter is active, show a message */}
        {filteredTodos.length === 0 && isFiltering && <p>No todos found</p>}
      </ul>
    </div>
  );
};

export default TodoList;
