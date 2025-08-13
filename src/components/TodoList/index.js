import React, { useState, useEffect } from "react";
// CSS
import "./TodoList.css";
// Components
import TodoItem from "../TodoItem";
// Utils
import { formatTodoText, validateTodo } from "../../utils/todoUtils";
import { getSortOptions } from "../../utils/sortingUtils";
// Icons
import {
  FaSearch,
  FaFilter,
  FaFlag,
  FaSort,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
// Components
import AddTodo from "../AddTodo";
// Hooks
// import { useLocalStorage } from "../../hooks/useLocalStorage";
import { usePriorities } from "../../hooks/usePriorities";
import { observer } from "mobx-react-lite";
import { useStores } from "../../stores/RootStoreContext";
import { sortPriorities } from "../../utils/priorityUtils";
import { useNavigate } from "react-router";
// import { userService } from "../../services/userService";
import StatusBanner from "../StatusBanner";

// Create the TodoList component
const TodoList = observer((props) => {
  const navigate = useNavigate();
  const { todoStore } = useStores();
  const [actionError, setActionError] = useState("");
  // States for adding a todo
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "",
    completed: false,
  });

  // Local UI state for mobile menu only. All server-driven state lives in the store.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initial load
  useEffect(() => {
    todoStore.fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filter =
    todoStore.completedFilter === true
      ? "completed"
      : todoStore.completedFilter === false
        ? "incomplete"
        : "all";
  const filterPriority = todoStore.priorityFilter;
  const search = todoStore.search;
  const sortBy = todoStore.sortBy;
  // Add priorities hook here
  const {
    priorities,
    loading: prioritiesLoading,
    error: prioritiesError,
  } = usePriorities();

  const page = todoStore.page;
  const totalPages = todoStore.totalPages;

  const processedTodos = todoStore.visibleTodos;

  // Function to toggle the completed status of a todo
  const toggleTodo = async (key) => {
    try {
      setActionError("");
      await todoStore.toggleTodo(key);
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
      await todoStore.deleteTodo(key);
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
      await todoStore.editTodo(key, { title: formatTodoText(text), priority });
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
      await todoStore.addTodo({
        title: newTodo.title,
        priority: newTodo.priority,
        description: newTodo.description,
      });
      setNewTodo({ title: "", priority: "" });
    } catch (e) {
      setActionError(e?.message || "Failed to add the todo. Please try again.");
    }
  };

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (prioritiesLoading) {
    return <StatusBanner type="loading">Loading…</StatusBanner>;
  }

  if (prioritiesError) {
    if (prioritiesError.message === "Unauthorized") {
      navigate("/login");
    }
    return <StatusBanner type="error">{prioritiesError}</StatusBanner>;
  }

  if (todoStore.loading) {
    return <StatusBanner type="loading">Loading…</StatusBanner>;
  }

  if (todoStore.error) {
    console.log(todoStore.error);
    if (todoStore.error === "Request failed with status code 401") {
      navigate("/login");
    }
    return <StatusBanner type="error">{todoStore.error}</StatusBanner>;
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
                  onChange={(e) => todoStore.setSearch(e.target.value)}
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
                    onChange={(e) =>
                      todoStore.setCompletedFilter(e.target.value)
                    }
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
                    onChange={(e) =>
                      todoStore.setPriorityFilter(e.target.value)
                    }
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
                    onChange={(e) => todoStore.setSort(e.target.value)}
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
                onChange={(e) => todoStore.setSearch(e.target.value)}
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
                    onChange={(e) =>
                      todoStore.setCompletedFilter(e.target.value)
                    }
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
                    onChange={(e) =>
                      todoStore.setPriorityFilter(e.target.value)
                    }
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
                    onChange={(e) => todoStore.setSort(e.target.value)}
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

            {/* Compact pager below Add Todo (hidden on mobile) */}
            <div className="compact-pager-row">
              <div className="compact-pager">
                <button
                  className="pager-btn"
                  onClick={() => todoStore.goToPrev()}
                  disabled={page <= 1}
                  title="Previous page"
                >
                  <FaChevronLeft />
                </button>
                <span className="pager-label">
                  {page} of {totalPages}
                </span>
                <button
                  className="pager-btn"
                  onClick={() => todoStore.goToNext()}
                  disabled={page >= totalPages}
                  title="Next page"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>

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

            {/* Pagination controls */}
            <div
              className="pagination-controls"
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                className="btn-secondary"
                onClick={() => todoStore.goToPrev()}
                disabled={page <= 1}
              >
                Previous
              </button>
              <div>
                Page {page} of {totalPages}
              </div>
              <button
                className="btn-secondary"
                onClick={() => todoStore.goToNext()}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
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
});

export default TodoList;
