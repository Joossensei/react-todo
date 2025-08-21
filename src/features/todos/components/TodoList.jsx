import React, { useState, useEffect, useRef } from "react";
// CSS
import "./styles/TodoList.css";
// Components
import TodoItem from "./TodoItem";
// Utils
import {
  formatTodoText,
  validateTodo,
  getSortOptions,
} from "../utils/todoUtils";
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
import AddTodo from "./AddTodo";
// Hooks
// import { useLocalStorage } from "../../hooks/useLocalStorage";
import { usePriorities } from "../../priorities/hooks/usePriorities";
import { observer } from "mobx-react-lite";
import { useStores } from "../../../stores/RootStoreContext";
import { sortPriorities } from "../../priorities/utils/priorityUtils";
import { useNavigate } from "react-router";
// import { userService } from "../../services/userService";
import StatusBanner from "../../../components/ui/StatusBanner";
import { getPriorityIcon } from "../../../constants/priorityIcons";

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

  // State for priority filter dropdown
  const [isPriorityFilterDropdownOpen, setIsPriorityFilterDropdownOpen] =
    useState(false);
  const priorityFilterDropdownRef = useRef(null);

  // Initial load
  useEffect(() => {
    todoStore.fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close priority filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        priorityFilterDropdownRef.current &&
        !priorityFilterDropdownRef.current.contains(event.target)
      ) {
        setIsPriorityFilterDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to handle priority filter selection
  const handlePriorityFilterSelect = (priorityValue) => {
    setIsPriorityFilterDropdownOpen(false);
    todoStore.setPriorityFilter(priorityValue);
  };

  // Helper function to get priority icon component
  const getPriorityIconComponent = (priority) => {
    const IconComponent = getPriorityIcon(priority, priority?.icon);
    return (
      <IconComponent
        style={{
          color:
            priority.color.charAt(0) === "#" && priority.color.charAt(1) === "0"
              ? "white"
              : "black",
        }}
      />
    );
  };

  // Get current priority data for filter
  const getCurrentPriorityFilter = (priorityValue) => {
    if (!priorityValue) return null;
    return priorities.find((p) => p.key === priorityValue);
  };

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

              <div className="filter-container" ref={priorityFilterDropdownRef}>
                <div className="priority-filter-field">
                  <div
                    id="filterPriority"
                    className="priority-filter-selector"
                    style={{
                      backgroundColor:
                        getCurrentPriorityFilter(filterPriority)?.color ||
                        "#e5e7eb",
                      borderRadius: isPriorityFilterDropdownOpen
                        ? "6px 6px 0 0"
                        : "6px",
                      border: isPriorityFilterDropdownOpen
                        ? "1px 1px 0 1px solid #e5e7eb"
                        : "1px solid #e5e7eb",
                      color:
                        getCurrentPriorityFilter(filterPriority)?.color.charAt(
                          0,
                        ) === "#" &&
                        getCurrentPriorityFilter(filterPriority)?.color.charAt(
                          1,
                        ) === "0"
                          ? "white"
                          : "black",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPriorityFilterDropdownOpen(
                        !isPriorityFilterDropdownOpen,
                      );
                    }}
                  >
                    <div className="priority-filter-icon">
                      {getCurrentPriorityFilter(filterPriority) ? (
                        getPriorityIconComponent(
                          getCurrentPriorityFilter(filterPriority),
                        )
                      ) : (
                        <FaFlag />
                      )}
                    </div>
                    <span className="priority-filter-label">
                      {getCurrentPriorityFilter(filterPriority)?.name ||
                        "All Priorities"}
                    </span>
                  </div>

                  {isPriorityFilterDropdownOpen && (
                    <div
                      className="priority-filter-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="priority-filter-option"
                        style={{
                          backgroundColor: "#e5e7eb",
                          color: "black",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePriorityFilterSelect("");
                        }}
                      >
                        <div className="priority-filter-icon">
                          <FaFlag />
                        </div>
                        <span className="priority-filter-label">
                          All Priorities
                        </span>
                      </div>
                      {sortPriorities(priorities).map((priority) => (
                        <div
                          key={priority.key}
                          className="priority-filter-option"
                          style={{
                            backgroundColor: priority.color,
                            color:
                              priority.color.charAt(0) === "#" &&
                              priority.color.charAt(1) === "0"
                                ? "white"
                                : "black",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePriorityFilterSelect(priority.key);
                          }}
                        >
                          <div className="priority-filter-icon">
                            {getPriorityIconComponent(priority)}
                          </div>
                          <span className="priority-filter-label">
                            {priority.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
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
