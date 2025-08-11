import React, { useEffect, useRef, useState } from "react";
import "./EditTodo.css";
import { usePriorities } from "../../hooks/usePriorities";
import { todoService } from "../../services/todoService";
import { getPriorityIcon } from "../../constants/priorityIcons";
import { useParams, useNavigate } from "react-router-dom";

const EditTodo = () => {
  const { id } = useParams();
  const todoKey = id;

  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  const {
    priorities,
    loading: prioritiesLoading,
    error: prioritiesError,
  } = usePriorities();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const priorityDropdownRef = useRef(null);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await todoService.getTodo(todoKey);
        // API returns single todo object or wrapped — support both
        const todo = data?.todo ?? data;
        setTitle(todo?.title ?? "");
        setDescription(todo?.description ?? "");
        setPriority(todo?.priority ?? "");
        setCompleted(Boolean(todo?.completed));
      } catch (err) {
        setError(err?.message || "Failed to load todo");
      } finally {
        setLoading(false);
      }
    };

    if (todoKey) {
      fetchTodo();
    }
  }, [todoKey]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(event.target)
      ) {
        setIsPriorityDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await todoService.updateTodo(todoKey, {
        title,
        description,
        priority,
        completed,
      });
      // Refresh todos
      await todoService.refreshTodos();
      // Go back to list; TodoList will refetch on mount
      handleBack();
    } catch (err) {
      setError(err?.message || "Failed to save todo");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-todo-page">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-todo-page">
        <div className="edit-todo-header-col">
          <button className="back-btn" onClick={handleBack}>
            &larr; Back
          </button>
          <h2 className="page-title">Edit Todo</h2>
        </div>
        <p className="error-text">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="edit-todo-page">
      <div className="edit-todo-header-col">
        <button className="back-btn" onClick={handleBack}>
          &larr; Back
        </button>
        <h2 className="page-title">Edit Todo</h2>
      </div>

      <div className="edit-todo-form">
        <div className="form-row">
          <label className="form-label" htmlFor="todoTitle">
            Title
          </label>
          <input
            id="todoTitle"
            type="text"
            className="text-input filter-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-row description-row">
          <label className="form-label" htmlFor="todoDescription">
            Description
          </label>
          <textarea
            id="todoDescription"
            className="textarea-input filter-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
          />
        </div>

        <div className="form-row priority-row" ref={priorityDropdownRef}>
          <label className="form-label" htmlFor="todoPriority">
            Priority
          </label>

          <div className="priority-field">
            <div
              id="todoPriority"
              className="edit-todo-item-priority"
              style={{
                backgroundColor:
                  priorities.find((p) => p.key === priority)?.color ||
                  "#e5e7eb",
                borderRadius: isPriorityDropdownOpen ? "6px 6px 0 0" : "6px",
                border: isPriorityDropdownOpen
                  ? "1px 1px 0 1px solid #e5e7eb"
                  : "1px solid #e5e7eb",
                color:
                  priorities
                    .find((p) => p.key === priority)
                    ?.color.charAt(0) === "#" &&
                  priorities
                    .find((p) => p.key === priority)
                    ?.color.charAt(1) === "0"
                    ? "white"
                    : "black",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsPriorityDropdownOpen(!isPriorityDropdownOpen);
              }}
            >
              <div className="edit-todo-item-priority-icon">
                {(() => {
                  const current = priorities.find((p) => p.key === priority);
                  const Icon = getPriorityIcon(current, current?.icon);
                  return <Icon />;
                })()}
              </div>
              <span className="edit-todo-item-priority-label">
                {priorities.find((p) => p.key === priority)?.name ||
                  (prioritiesLoading
                    ? "Loading priorities..."
                    : "Select Priority")}
              </span>
            </div>

            {isPriorityDropdownOpen && (
              <div
                className="edit-todo-item-priority-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                {priorities.map((p) => {
                  const Icon = getPriorityIcon(p, p?.icon);
                  return (
                    <div
                      key={p.key}
                      className="edit-todo-item-priority-option"
                      style={{
                        backgroundColor: p.color,
                        color:
                          p.color.charAt(0) === "#" && p.color.charAt(1) === "0"
                            ? "white"
                            : "black",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPriority(p.key);
                        setIsPriorityDropdownOpen(false);
                      }}
                    >
                      <div className="edit-todo-item-priority-icon">
                        <Icon />
                      </div>
                      <span className="edit-todo-item-priority-label">
                        {p.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Completed</label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            <span>Completed</span>
          </label>
        </div>

        <div className="form-actions">
          <button
            className="secondary-btn"
            onClick={handleBack}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="primary-btn"
            onClick={handleSave}
            disabled={saving || !title || !priority}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTodo;
