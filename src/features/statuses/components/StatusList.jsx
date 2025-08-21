import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router";
import { FaPlus, FaEdit, FaTrash, FaGripVertical } from "react-icons/fa";
import { useStatuses } from "../hooks/useStatuses";
import { statusStore } from "../stores/StatusStore";
import { getIconComponent } from "../../../constants/priorityIcons";
import "./styles/StatusListing.css";

const StatusList = observer(() => {
  const {
    statuses,
    loading,
    error,
    total,
    page,
    size,
    fetchStatuses,
    deleteStatus,
    reorderStatuses,
  } = useStatuses();

  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDelete = async (key) => {
    try {
      await deleteStatus(key);
      setShowConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting status:", error);
    }
  };

  const handleDragStart = (e, status) => {
    setDraggedItem(status);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.key === targetStatus.key) {
      setDraggedItem(null);
      return;
    }

    try {
      await reorderStatuses(
        draggedItem.key,
        draggedItem.order,
        targetStatus.order,
      );
    } catch (error) {
      console.error("Error reordering statuses:", error);
    } finally {
      setDraggedItem(null);
    }
  };

  if (loading && statuses.length === 0) {
    return (
      <div className="status-listing-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading statuses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-listing-container">
        <div className="error-container">
          <h3>Error loading statuses</h3>
          <p>{error}</p>
          <button onClick={() => fetchStatuses()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="status-listing-container">
      {/* Header Section */}
      <div className="status-listing-header">
        <div className="header-content">
          <h2>Status Management</h2>
          <p>Manage your todo statuses and their order</p>
        </div>
        <div className="header-actions">
          <Link to="/statuses/new" className="btn-primary">
            <FaPlus />
            New Status
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="status-table-container">
        <div className="table-header">
          <h3>Statuses ({total})</h3>
        </div>

        {statuses.length === 0 ? (
          <div className="empty-state">
            <p>No statuses found. Create your first status to get started.</p>
            <Link to="/statuses/new" className="btn-primary">
              <FaPlus />
              Create Status
            </Link>
          </div>
        ) : (
          <div className="status-table">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Name</th>
                  <th>Icon</th>
                  <th>Color</th>
                  <th>Description</th>
                  <th>Default</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {statuses.map((status) => (
                  <tr
                    key={status.key}
                    className={
                      draggedItem?.key === status.key ? "dragging" : ""
                    }
                    draggable
                    onDragStart={(e) => handleDragStart(e, status)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, status)}
                  >
                    <td className="order-cell">
                      <div className="drag-handle">
                        <FaGripVertical />
                      </div>
                      <div className="order-badge">{status.order}</div>
                    </td>
                    <td className="name-cell">
                      <span className="status-name">{status.name}</span>
                    </td>
                    <td className="icon-cell">
                      {getIconComponent(status.icon, status.color)}
                    </td>
                    <td className="color-cell">
                      <div className="color-preview">
                        <div
                          className="color-swatch"
                          style={{ backgroundColor: status.color }}
                        ></div>
                        <span className="color-code">{status.color}</span>
                      </div>
                    </td>
                    <td className="description-cell">
                      <span className="description-text">
                        {status.description || "No description"}
                      </span>
                    </td>
                    <td className="default-cell">
                      <span
                        className={`status-badge ${status.is_default ? "default" : ""}`}
                      >
                        {status.is_default ? "Default" : "Custom"}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <Link
                          to={`/statuses/${status.key}`}
                          className="btn-icon btn-edit"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => setShowConfirmDelete(status.key)}
                          title="Delete"
                          disabled={status.is_default}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete this status? This action cannot be
              undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={() => handleDelete(showConfirmDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default StatusList;
