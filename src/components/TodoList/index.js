import React, { useState } from "react";
import "./TodoList.css";
import TodoItem from "../TodoItem";
import AddTodo from "../AddTodo";
import {
  getPriorityOrder,
  getPriorityByValue,
} from "../../utils/priorityUtils";

import {
  generateTodoId,
  formatTodoText,
  validateTodo,
} from "../../utils/todoUtils";
import { PRIORITY } from "../../constants";

// Create the TodoList component
const TodoList = (props) => {
  // States for the todos
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: "Learn React",
      completed: false,
      priority: PRIORITY.LOW.value,
    },
    {
      id: 2,
      text: "Build Todo App",
      completed: true,
      priority: PRIORITY.MEDIUM.value,
    },
    {
      id: 3,
      text: "Write Tests",
      completed: false,
      priority: PRIORITY.HIGH.value,
    },
    {
      id: 4,
      text: "Learn React Testing",
      completed: false,
      priority: PRIORITY.URGENT.value,
    },
  ]);
  // States for adding a todo
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [newTodo, setNewTodo] = useState({
    text: "",
    priority: "",
  });
  // States for filtering the todos
  const [isFiltering, setIsFiltering] = useState(false);
  const [filter, setFilter] = useState("all");
  const [filterPriority, setFilterPriority] = useState("");
  const [filteredTodos, setFilteredTodos] = useState([]); // Array to store the filtered todos
  // States for searching for a todo
  const [search, setSearch] = useState("");

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
    setIsAddingTodo(false);
    setTodos([
      ...todos,
      {
        id: generateTodoId(todos),
        text: formatTodoText(newTodo.text),
        completed: false,
        priority: newTodo.priority,
      },
    ]);
    setNewTodo({ text: "", priority: "" });
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

  // Function to filter the todos by priority
  const handleChangeFilterPriority = (e) => {
    setFilterPriority(e.target.value);
    setIsFiltering(true);
    // Filter the todos by the priority value
    setFilteredTodos(todos.filter((todo) => todo.priority === e.target.value));
    // If the filter value is empty, show all todos
    if (e.target.value === "") {
      setTodos(todos);
      setFilteredTodos([]);
      setIsFiltering(false);
    }
    // If the filter value is not empty, filter the todos by the priority value
    else {
      setFilteredTodos(
        todos.filter((todo) => todo.priority === e.target.value),
      );
      setIsFiltering(true);
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
        {/* Filter by priority */}
        <select
          id="filterTodos"
          className="filter-select"
          value={filterPriority}
          onChange={handleChangeFilterPriority}
        >
          <option value="">Filter by priority</option>
          {getPriorityOrder().map((priority) => (
            <option key={priority} value={priority}>
              {getPriorityByValue(priority).label}
            </option>
          ))}
        </select>
      </div>
      <AddTodo
        onAddTodo={handleAddTodo}
        isAddingTodo={isAddingTodo}
        setIsAddingTodo={setIsAddingTodo}
        newTodo={newTodo}
        setNewTodo={setNewTodo}
      />
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
