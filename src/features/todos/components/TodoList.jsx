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
  FaCircle,
  FaUndo,
} from "react-icons/fa";
// Components
import AddTodo from "./AddTodo";
// Hooks
// import { useLocalStorage } from "../../hooks/useLocalStorage";
import { usePriorities } from "../../priorities/hooks/usePriorities";
import { useStatuses } from "../../statuses/hooks/useStatuses";
import { observer } from "mobx-react-lite";
import { useStores } from "../../../stores/RootStoreContext";
import { sortPriorities } from "../../priorities/utils/priorityUtils";
import { useNavigate } from "react-router";
// import { userService } from "../../services/userService";
import StatusBanner from "../../../components/ui/StatusBanner";
import {
  getIconComponent,
  getPriorityIcon,
} from "../../../constants/priorityIcons";

// Create the TodoList component
const TodoList = observer((props) => {
  const navigate = useNavigate();
  const { todoStore } = useStores();
  const [actionError, setActionError] = useState("");

  // Enhanced delete functionality state
  const [undoStack, setUndoStack] = useState([]);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [lastDeletedTodo, setLastDeletedTodo] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);

  // States for adding a todo
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    completed: false,
  });

  // Local UI state for mobile menu only. All server-driven state lives in the store.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for priority filter dropdown
  const [isPriorityFilterDropdownOpen, setIsPriorityFilterDropdownOpen] =
    useState(false);
  const priorityFilterDropdownRef = useRef(null);

  // State for status filter dropdown
  const [isStatusFilterDropdownOpen, setIsStatusFilterDropdownOpen] =
    useState(false);
  const statusFilterDropdownRef = useRef(null);

  // Initial load
  useEffect(() => {
    todoStore.fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup undo timeout on unmount
  useEffect(() => {
    return () => {
      if (undoTimeout) {
        clearTimeout(undoTimeout);
      }
    };
  }, [undoTimeout]);

  // Close priority filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        priorityFilterDropdownRef.current &&
        !priorityFilterDropdownRef.current.contains(event.target)
      ) {
        setIsPriorityFilterDropdownOpen(false);
      }
      if (
        statusFilterDropdownRef.current &&
        !statusFilterDropdownRef.current.contains(event.target)
      ) {
        setIsStatusFilterDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to provide haptic feedback
  const triggerHapticFeedback = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(50); // Short haptic feedback
    }
  };

  // Function to show undo toast
  const displayUndoToast = () => {
    setShowUndoToast(true);
    // Auto-hide after 30 seconds
    const timeout = setTimeout(() => {
      setShowUndoToast(false);
      setLastDeletedTodo(null);
    }, 30000);
    setUndoTimeout(timeout);
  };

  // Function to handle undo
  const handleUndo = async () => {
    if (lastDeletedTodo) {
      try {
        setActionError("");
        // Restore the todo
        await todoStore.addTodo(lastDeletedTodo);
        setShowUndoToast(false);
        setLastDeletedTodo(null);
        if (undoTimeout) {
          clearTimeout(undoTimeout);
          setUndoTimeout(null);
        }
      } catch (e) {
        setActionError("Failed to restore the todo. Please try again.");
      }
    }
  };

  // Function to handle priority filter selection
  const handlePriorityFilterSelect = (priorityValue) => {
    setIsPriorityFilterDropdownOpen(false);
    todoStore.setPriorityFilter(priorityValue);
  };

  // Function to handle status filter selection
  const handleStatusFilterSelect = (statusValue) => {
    setIsStatusFilterDropdownOpen(false);
    todoStore.setStatusFilter(statusValue);
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

  // Helper function to get status icon component
  const getStatusIconComponent = (status) => {
    if (!status) return <div></div>;
    return getIconComponent(
      status.icon,
      status.color.charAt(0) === "#" && status.color.charAt(1) === "0"
        ? "white"
        : "black",
    );
  };

  // Get current priority data for filter
  const getCurrentPriorityFilter = (priorityValue) => {
    if (!priorityValue) return null;
    return priorities.find((p) => p.key === priorityValue);
  };

  // Get current status data for filter
  const getCurrentStatusFilter = (statusValue) => {
    if (!statusValue) return null;
    return statuses.find((s) => s.key === statusValue);
  };

  const filter =
    todoStore.completedFilter === true
      ? "completed"
      : todoStore.completedFilter === false
        ? "incomplete"
        : "all";
  const filterPriority = todoStore.priorityFilter;
  const filterStatus = todoStore.statusFilter;
  const search = todoStore.search;
  const sortBy = todoStore.sortBy;

  // Add priorities hook here
  const {
    priorities,
    loading: prioritiesLoading,
    error: prioritiesError,
  } = usePriorities();

  // Add statuses hook here
  const {
    statuses,
    loading: statusesLoading,
    error: statusesError,
  } = useStatuses();

  // Temporarily use empty statuses to avoid 404 errors

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

  // Enhanced delete function with undo capability
  const deleteTodoWithUndo = async (key) => {
    try {
      setActionError("");

      // Find the todo before deleting
      const todoToDelete = todoStore.todos.find((t) => t.key === key);
      if (!todoToDelete) return;

      // Trigger haptic feedback
      triggerHapticFeedback();

      // Store the deleted todo for potential undo
      setLastDeletedTodo(todoToDelete);

      // Show undo toast
      displayUndoToast();

      // Actually delete the todo
      await todoStore.deleteTodo(key);

      // Set a timeout to clear the undo option after 30 seconds
      const timeout = setTimeout(() => {
        setShowUndoToast(false);
        setLastDeletedTodo(null);
      }, 30000);
      setUndoTimeout(timeout);
    } catch (e) {
      setActionError(
        e?.message || "Failed to delete the todo. Please try again.",
      );
      setShowUndoToast(false);
      setLastDeletedTodo(null);
    }
  };

  // Function to delete a todo (legacy - keeping for compatibility)
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
  const handleEditTodo = async (key, text, priority, status) => {
    try {
      setActionError("");
      await todoStore.editTodo(key, {
        title: formatTodoText(text),
        priority,
        status,
      });
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
        status: newTodo.status,
        description: newTodo.description,
      });
      setNewTodo({ title: "", priority: "", status: "" });
    } catch (e) {
      setActionError(e?.message || "Failed to add the todo. Please try again.");
    }
  };

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (prioritiesLoading || statusesLoading) {
    return <StatusBanner type="loading">Loading…</StatusBanner>;
  }

  if (prioritiesError) {
    if (prioritiesError?.message === "Unauthorized") {
      navigate("/login");
    }
    return <StatusBanner type="error">{prioritiesError}</StatusBanner>;
  }

  // Temporarily disable status error handling to see if that fixes the issue
  if (statusesError) {
    if (statusesError?.message === "Unauthorized") {
      navigate("/login");
    }
    return <StatusBanner type="error">{statusesError}</StatusBanner>;
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

      {/* Undo Toast */}
      {showUndoToast && (
        <div className="undo-toast">
          <div className="undo-toast-content">
            <span>Todo deleted</span>
            <button
              className="undo-btn"
              onClick={handleUndo}
              disabled={todoStore.loading}
            >
              <FaUndo />
              Undo
            </button>
          </div>
        </div>
      )}

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
                <div className="priority-filter-icon">
                  <FaFlag />
                </div>
                <div className="priority-filter-field">
                  <div
                    id="filterPriority"
                    className="priority-filter-selector"
                    style={{
                      backgroundColor:
                        getCurrentPriorityFilter(filterPriority)?.color ||
                        "var(--primary-bg)",
                      borderRadius: isPriorityFilterDropdownOpen
                        ? "6px 6px 0 0"
                        : "6px",
                      border: isPriorityFilterDropdownOpen
                        ? "2px 2px 0 2px solid var(--border-color)"
                        : "2px solid var(--border-color)",
                      color:
                        getCurrentPriorityFilter(filterPriority)?.color.charAt(
                          0,
                        ) === "#" &&
                        getCurrentPriorityFilter(filterPriority)?.color.charAt(
                          1,
                        ) === "0"
                          ? "var(--text-primary)"
                          : "var(--text-primary)",
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
                        <div></div>
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

              {statuses.length > 0 && (
                <div className="filter-container" ref={statusFilterDropdownRef}>
                  <div className="status-filter-icon">
                    <FaCircle />
                  </div>
                  <div className="status-filter-field">
                    <div
                      id="filterStatus"
                      className="status-filter-selector"
                      style={{
                        backgroundColor:
                          getCurrentStatusFilter(filterStatus)?.color ||
                          "var(--primary-bg)",
                        borderRadius: isStatusFilterDropdownOpen
                          ? "6px 6px 0 0"
                          : "6px",
                        border: isStatusFilterDropdownOpen
                          ? "2px 2px 0 2px solid var(--border-color)"
                          : "2px solid var(--border-color)",
                        color:
                          getCurrentStatusFilter(filterStatus)?.color.charAt(
                            0,
                          ) === "#" &&
                          getCurrentStatusFilter(filterStatus)?.color.charAt(
                            1,
                          ) === "0"
                            ? "var(--text-primary)"
                            : "var(--text-primary)",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsStatusFilterDropdownOpen(
                          !isStatusFilterDropdownOpen,
                        );
                      }}
                    >
                      <div className="status-filter-icon">
                        {getCurrentStatusFilter(filterStatus) ? (
                          getStatusIconComponent(
                            getCurrentStatusFilter(filterStatus),
                          )
                        ) : (
                          <div></div>
                        )}
                      </div>
                      <span className="status-filter-label">
                        {getCurrentStatusFilter(filterStatus)?.name ||
                          "All Statuses"}
                      </span>
                    </div>

                    {isStatusFilterDropdownOpen && (
                      <div
                        className="status-filter-dropdown"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="status-filter-option"
                          style={{
                            backgroundColor: "#e5e7eb",
                            color: "black",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusFilterSelect("");
                          }}
                        >
                          <div className="status-filter-icon">
                            <FaCircle />
                          </div>
                          <span className="status-filter-label">
                            All Statuses
                          </span>
                        </div>
                        {statuses.map((status) => (
                          <div
                            key={status.key}
                            className="status-filter-option"
                            style={{
                              backgroundColor: status.color,
                              color:
                                status.color.charAt(0) === "#" &&
                                status.color.charAt(1) === "0"
                                  ? "white"
                                  : "black",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusFilterSelect(status.key);
                            }}
                          >
                            <div className="status-filter-icon">
                              {getStatusIconComponent(status)}
                            </div>
                            <span className="status-filter-label">
                              {status.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                <h4>Filter by Completion</h4>
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
                    {priorities.map((priority) => (
                      <option key={priority.key} value={priority.key}>
                        {priority.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {statuses.length > 0 && (
                <div className="mobile-menu-section">
                  <h4>Filter by Status</h4>
                  <div className="custom-select">
                    <select
                      className="mobile-filter-select"
                      value={filterStatus}
                      onChange={(e) =>
                        todoStore.setStatusFilter(e.target.value)
                      }
                      disabled={statusesLoading}
                    >
                      <option value="">All Statuses</option>
                      {statuses.map((status) => (
                        <option key={status.key} value={status.key}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="mobile-menu-section">
                <h4>Sort by</h4>
                <div className="custom-select">
                  <select
                    className="mobile-filter-select"
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
              statuses={statuses}
              prioritiesLoading={prioritiesLoading}
              statusesLoading={statusesLoading}
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
                    deleteTodo={deleteTodoWithUndo}
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
