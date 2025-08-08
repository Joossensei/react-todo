import React, { useState } from "react";
// CSS
import "./PriorityListing.css";
// Hooks
import { usePriorities } from "../../hooks/usePriorities";
// Services
import { priorityService } from "../../services/priorityService";
// Components
import EditPriority from "../EditPriority";
// Icons
import { getIconComponent } from "../../constants/priorityIcons";
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";

const PriorityList = () => {
  // States for priorities management
  const {
    priorities,
    loading: prioritiesLoading,
    error: prioritiesError,
    refreshPriorities,
  } = usePriorities();

  // States for UI interactions
  const [editingPriority, setEditingPriority] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [deletingPriority, setDeletingPriority] = useState(null);

  // Function to handle priority save (create or update)
  const handlePrioritySave = async (priorityData) => {
    try {
      if (editingPriority) {
        // Update existing priority
        await priorityService.updatePriority(editingPriority.key, priorityData);
      } else {
        // Create new priority
        await priorityService.createPriority(priorityData);
      }

      // Refresh priorities list
      await refreshPriorities();

      // Reset form state
      setEditingPriority(null);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save priority:", error);
      alert("Failed to save priority. Please try again.");
    }
  };

  // Function to handle priority deletion
  const handlePriorityDelete = async (priority) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${priority.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      setDeletingPriority(priority.key);
      await priorityService.deletePriority(priority.key);
      await refreshPriorities();
    } catch (error) {
      console.error("Failed to delete priority:", error);
      alert("Failed to delete priority. Please try again.");
    } finally {
      setDeletingPriority(null);
    }
  };

  // Function to handle edit button click
  const handleEditClick = (priority) => {
    setEditingPriority(priority);
    setShowForm(true);
  };

  // Function to handle new priority button click
  const handleNewPriorityClick = () => {
    setEditingPriority(null);
    setShowForm(true);
  };

  // Function to handle form cancel
  const handleFormCancel = () => {
    setEditingPriority(null);
    setShowForm(false);
  };

  // Function to toggle description visibility
  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  // Loading state
  if (prioritiesLoading) {
    return (
      <div className="priority-listing-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading priorities...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (prioritiesError) {
    return (
      <div className="priority-listing-container">
        <div className="error-container">
          <h3>Error Loading Priorities</h3>
          <p>{prioritiesError}</p>
          <button className="btn-primary" onClick={refreshPriorities}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="priority-listing-container">
      <div className="priority-listing-header">
        <div className="header-content">
          <h2>Priority Management</h2>
          <p>Manage your task priorities and their visual representations.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleNewPriorityClick}>
            <FaPlus />
            New Priority
          </button>
        </div>
      </div>

      {showForm && (
        <div className="priority-form-section">
          <h3>{editingPriority ? "Edit Priority" : "Create New Priority"}</h3>
          <EditPriority
            priority={editingPriority}
            onSave={handlePrioritySave}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      <div className="priority-table-container">
        <div className="table-header">
          <h3>Priority List ({priorities.length})</h3>
          <button
            className="btn-secondary toggle-description-btn"
            onClick={toggleDescription}
          >
            {showDescription ? <FaEyeSlash /> : <FaEye />}
            {showDescription ? "Hide" : "Show"} Descriptions
          </button>
        </div>

        {priorities.length === 0 ? (
          <div className="empty-state">
            <p>
              No priorities found. Create your first priority to get started!
            </p>
            <button className="btn-primary" onClick={handleNewPriorityClick}>
              <FaPlus />
              Create First Priority
            </button>
          </div>
        ) : (
          <div className="priority-table">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Name</th>
                  <th>Icon</th>
                  <th>Color</th>
                  {showDescription && <th>Description</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {priorities
                  .sort((a, b) => a.order - b.order)
                  .map((priority) => (
                    <tr key={priority.key}>
                      <td className="order-cell">
                        <span className="order-badge">{priority.order}</span>
                      </td>
                      <td className="name-cell">
                        <span
                          className="priority-name"
                          style={{ color: priority.color }}
                        >
                          {priority.name}
                        </span>
                      </td>
                      <td className="icon-cell">
                        {getIconComponent(priority.icon, priority.color)}
                      </td>
                      <td className="color-cell">
                        <div className="color-preview">
                          <div
                            className="color-swatch"
                            style={{ backgroundColor: priority.color }}
                          ></div>
                          <span className="color-code">{priority.color}</span>
                        </div>
                      </td>
                      {showDescription && (
                        <td className="description-cell">
                          <span className="description-text">
                            {priority.description || "No description"}
                          </span>
                        </td>
                      )}
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEditClick(priority)}
                            title="Edit priority"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handlePriorityDelete(priority)}
                            disabled={deletingPriority === priority.key}
                            title="Delete priority"
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
    </div>
  );
};

export default PriorityList;
