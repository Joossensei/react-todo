import React, { useState } from "react";
// CSS
import "./TodoList.css";
// Components
import TodoItem from "../TodoItem";
// Utils
import { formatTodoText, validateTodo } from "../../utils/todoUtils";
import { sortTodos, getSortOptions } from "../../utils/sortingUtils";
// Icons
import { FaSearch, FaFilter, FaFlag, FaSort, FaBars } from "react-icons/fa";
// Components
import AddTodo from "../AddTodo";
// Hooks
// import { useLocalStorage } from "../../hooks/useLocalStorage";
import { usePriorities } from "../../hooks/usePriorities";
import { useTodos } from "../../hooks/useTodos";
import { todoService } from "../../services/todoService";
import { sortPriorities } from "../../utils/priorityUtils";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import StatusBanner from "../StatusBanner";

// Create the TodoList component
const TodoList = (props) => {
  const navigate = useNavigate();
  const [actionError, setActionError] = useState("");
  // States for adding a todo
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "",
    completed: false,
  });

  // States for filtering the todos (reset on refresh)
  const [filter, setFilter] = useState("all");
  const [filterPriority, setFilterPriority] = useState("");
  const [search, setSearch] = useState("");

  // States for sorting (reset on refresh)
  const [sortBy, setSortBy] = useState("incomplete-priority-desc");

  // States for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Add priorities hook here
  const {
    priorities,
    loading: prioritiesLoading,
    error: prioritiesError,
  } = usePriorities();

  const {
    todos,
    loading: todosLoading,
    error: todosError,
    refreshTodos,
  } = useTodos();

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
        todo.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Apply sorting
    return sortTodos(processedTodos, priorities, sortBy);
  };

  // Function to toggle the completed status of a todo
  const toggleTodo = async (key) => {
    try {
      setActionError("");
      const todo = todos.find((todo) => todo.key === key);
      if (!todo) return;
      await todoService.patchTodo(key, { completed: !todo.completed });
      await refreshTodos();
    } catch (e) {
      setActionError(
        e?.message || "Failed to update the todo. Please try again.",
      );
    }
  };

  // Function to delete a todo
  const deleteTodo = async (key) => {
    try {
      setActionError("");
      await todoService.deleteTodo(key);
      await refreshTodos();
    } catch (e) {
      setActionError(
        e?.message || "Failed to delete the todo. Please try again.",
      );
    }
  };

  // Function to edit a todo (used in TodoItem component)
  const handleEditTodo = async (key, text, priority) => {
    try {
      setActionError("");
      const todo = todos.find((todo) => todo.key === key);
      if (!todo) return;
      await todoService.patchTodo(key, {
        title: formatTodoText(text),
        priority: priority || todo.priority,
        completed: todo.completed,
        description: todo.description,
      });
      await refreshTodos();
    } catch (e) {
      setActionError(e?.message || "Failed to save changes. Please try again.");
    }
  };

  // Function to add a todo
  const handleAddTodo = async () => {
    try {
      setActionError("");
      if (!validateTodo(newTodo.title) || newTodo.priority === "") {
        return;
      }
      setIsAddingTodo(false);
      newTodo.user_key = userService.getUserKey();
      await todoService.createTodo(newTodo);
      await refreshTodos();
      setNewTodo({ title: "", priority: "" });
    } catch (e) {
      setActionError(e?.message || "Failed to add the todo. Please try again.");
    }
  };

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const processedTodos = getProcessedTodos();

  if (prioritiesLoading) {
    return <StatusBanner type="loading">Loading…</StatusBanner>;
  }

  if (prioritiesError) {
    if (prioritiesError.message === "Unauthorized") {
      navigate("/login");
    }
    return <StatusBanner type="error">{prioritiesError}</StatusBanner>;
  }

  if (todosLoading) {
    return <StatusBanner type="loading">Loading…</StatusBanner>;
  }

  if (todosError) {
    console.log(todosError);
    if (todosError === "Request failed with status code 401") {
      navigate("/login");
    }
    return <StatusBanner type="error">{todosError}</StatusBanner>;
  }

  return (
    <div className="todo-list-container">
      <h1>{props.title}</h1>

      {actionError && <StatusBanner type="error">{actionError}</StatusBanner>}

      {priorities.length > 0 && (
        <div>
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
                <div className="custom-select">
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
              </div>

              <div className="filter-container">
                <FaFlag className="priority-icon" />
                <div className="custom-select">
                  <select
                    id="filterPriority"
                    className="filter-select"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    disabled={prioritiesLoading}
                  >
                    <option value="">All Priorities</option>
                    {sortPriorities(priorities).map((priority) => (
                      <option key={priority.key} value={priority.key}>
                        {priority.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Row 3: Sort */}
            <div className="header-row sort-row">
              <div className="sort-container">
                <FaSort className="sort-icon" />
                <div className="custom-select">
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
                <div className="custom-select">
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
              </div>

              <div className="mobile-menu-section">
                <h4>Filter by Priority</h4>
                <div className="custom-select">
                  <select
                    className="mobile-filter-select"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    disabled={prioritiesLoading}
                  >
                    <option value="">All Priorities</option>
                    {sortPriorities(priorities).map((priority) => (
                      <option key={priority.key} value={priority.key}>
                        {priority.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mobile-menu-section">
                <h4>Sort by</h4>
                <div className="custom-select">
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
            </div>
          )}
          <div>
            {/* Add Todo Section */}
            <AddTodo
              onAddTodo={handleAddTodo}
              isAddingTodo={isAddingTodo}
              setIsAddingTodo={setIsAddingTodo}
              newTodo={newTodo}
              setNewTodo={setNewTodo}
              priorities={sortPriorities(priorities)}
              prioritiesLoading={prioritiesLoading}
            />

            {/* Todo List */}
            <ul className="todo-list">
              {processedTodos.length === 0 ? (
                <p>No todos to show</p>
              ) : (
                processedTodos.map((todo) => (
                  <TodoItem
                    key={todo.key}
                    todo={todo}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
                    editTodo={handleEditTodo}
                    onOpen={() => navigate(`/todos/${todo.key}`)}
                    priorities={sortPriorities(priorities)}
                  />
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      <div>
        {priorities.length === 0 && (
          <div>
            <h2>No priorities found</h2>
            <p>Please create a priority to get started</p>
            <button onClick={() => navigate("/priorities/new")}>
              Create Priority
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
