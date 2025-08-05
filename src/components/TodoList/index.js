import React, { useState } from "react";
// CSS
import "./TodoList.css";
// Components
import TodoItem from "../TodoItem";
// Utils
import {
  generateTodoId,
  formatTodoText,
  validateTodo,
} from "../../utils/todoUtils";
import {
  getPriorityByValue,
  getPriorityOrder,
} from "../../utils/priorityUtils";
import { sortTodos, getSortOptions } from "../../utils/sortingUtils";
// Icons
import { FaSearch, FaFilter, FaFlag, FaSort, FaBars } from "react-icons/fa";
// Components
import AddTodo from "../AddTodo";
// Hooks
import { useLocalStorage } from "../../hooks/useLocalStorage";

// Create the TodoList component
const TodoList = (props) => {
  // States for the todos using localStorage persistence
  const [todos, setTodos] = useLocalStorage("todos", props.standardTodos);

  // States for adding a todo
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [newTodo, setNewTodo] = useState({
    text: "",
    priority: "",
  });

  // States for filtering the todos (reset on refresh)
  const [filter, setFilter] = useState("all");
  const [filterPriority, setFilterPriority] = useState("");
  const [search, setSearch] = useState("");

  // States for sorting (reset on refresh)
  const [sortBy, setSortBy] = useState("priority-desc");

  // States for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to get processed todos (filtered and sorted)
  const getProcessedTodos = () => {
    let processedTodos = [...todos];

    // Apply completed filter
    if (filter !== "all") {
      processedTodos = processedTodos.filter((todo) => {
        if (filter === "completed") return todo.completed;
        if (filter === "incomplete") return !todo.completed;
        return true;
      });
    }

    // Apply priority filter
    if (filterPriority !== "") {
      processedTodos = processedTodos.filter(
        (todo) => todo.priority === filterPriority,
      );
    }

    // Apply search filter
    if (search !== "") {
      processedTodos = processedTodos.filter((todo) =>
        todo.text.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Apply sorting
    return sortTodos(processedTodos, sortBy);
  };

  // Function to toggle the completed status of a todo
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  // Function to delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Function to edit a todo (used in TodoItem component)
  const handleEditTodo = (id, text, priority) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text, priority } : todo,
      ),
    );
  };

  // Function to add a todo
  const handleAddTodo = () => {
    if (!validateTodo(newTodo.text) || newTodo.priority === "") {
      return;
    }
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

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const processedTodos = getProcessedTodos();

  return (
    <div className="todo-list-container">
      <h1>{props.title}</h1>

      {/* Desktop Header */}
      <div className="todo-list-header desktop-header">
        {/* Row 1: Search */}
        <div className="header-row search-row">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              id="searchTodos"
              type="text"
              placeholder="Search todos..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Row 2: Filters */}
        <div className="header-row filter-row">
          <div className="filter-container">
            <FaFilter className="filter-icon" />
            <select
              id="filterTodos"
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>

          <div className="filter-container">
            <FaFlag className="priority-icon" />
            <select
              id="filterPriority"
              className="filter-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              {getPriorityOrder().map((priority) => (
                <option key={priority} value={priority}>
                  {getPriorityByValue(priority).label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Sort */}
        <div className="header-row sort-row">
          <div className="sort-container">
            <FaSort className="sort-icon" />
            <select
              id="sortTodos"
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {getSortOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="todo-list-header mobile-header">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            id="searchTodosMobile"
            type="text"
            placeholder="Search todos..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="hamburger-menu" onClick={toggleMobileMenu}>
          <FaBars />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-section">
            <h4>Filter by Status</h4>
            <select
              className="mobile-filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>

          <div className="mobile-menu-section">
            <h4>Filter by Priority</h4>
            <select
              className="mobile-filter-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              {getPriorityOrder().map((priority) => (
                <option key={priority} value={priority}>
                  {getPriorityByValue(priority).label}
                </option>
              ))}
            </select>
          </div>

          <div className="mobile-menu-section">
            <h4>Sort by</h4>
            <select
              className="mobile-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {getSortOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Add Todo Section */}
      <AddTodo
        onAddTodo={handleAddTodo}
        isAddingTodo={isAddingTodo}
        setIsAddingTodo={setIsAddingTodo}
        newTodo={newTodo}
        setNewTodo={setNewTodo}
      />

      {/* Todo List */}
      <ul className="todo-list">
        {processedTodos.length === 0 ? (
          <p>No todos to show</p>
        ) : (
          processedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              editTodo={handleEditTodo}
            />
          ))
        )}
      </ul>
    </div>
  );
};

export default TodoList;
