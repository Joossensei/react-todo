import React, { useEffect, useState } from "react";
// CSS
import "./PriorityListing.css";
// Hooks
import { observer } from "mobx-react-lite";
import { useStores } from "../../stores/RootStoreContext";
// Services
import { priorityService } from "../../services/priorityService";
// Components
import EditPriority from "../EditPriority";
// Icons
import { getIconComponent } from "../../constants/priorityIcons";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaEye,
  FaEyeSlash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import StatusBanner from "../StatusBanner";

const PriorityList = observer(() => {
  const navigate = useNavigate();
  const { priorityStore } = useStores();

  // States for priorities management
  useEffect(() => {
    priorityStore.fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // States for UI interactions
  const [editingPriority, setEditingPriority] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [deletingPriority, setDeletingPriority] = useState(null);
  const [listError, setListError] = useState("");

  // Function to handle priority save (create or update)
  const handlePrioritySave = async (priorityData) => {
    try {
      setListError("");
      if (editingPriority) {
        // Update existing priority
        await priorityStore.updatePriority(editingPriority.key, priorityData);
      } else {
        // Create new priority
        await priorityStore.createPriority(priorityData);
      }

      // Refresh priorities list
      await priorityStore.refetch(true);

      // Reset form state
      setEditingPriority(null);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save priority:", error);
      setListError(
        error?.message || "Failed to save priority. Please try again.",
      );
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
      setListError("");
      await priorityStore.deletePriority(priority.key);
    } catch (error) {
      console.error("Failed to delete priority:", error);
      setListError(
        error?.message || "Failed to delete priority. Please try again.",
      );
    } finally {
      setDeletingPriority(null);
    }
  };

  // Function to handle edit button click
  const handleEditClick = (priority) => {
    navigate(`/priorities/${priority.key}`);
  };

  // Function to handle new priority button click
  const handleNewPriorityClick = () => {
    navigate(`/priorities/new`);
  };

  // Function to handle form cancel
  const handleFormCancel = async () => {
    navigate(-1);
    // Ensure list refreshes after returning from form
    setTimeout(() => {
      priorityStore.refetch(true);
    }, 0);
  };

  // Function to toggle description visibility
  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  // Loading state
  if (priorityStore.loading) {
    return (
      <div className="priority-listing-container">
        <StatusBanner type="loading">Loading priorities…</StatusBanner>
      </div>
    );
  }

  // Error state
  if (priorityStore.error) {
    return (
      <div className="priority-listing-container">
        <StatusBanner type="error">{priorityStore.error}</StatusBanner>
      </div>
    );
  }

  return (
    <div className="priority-listing-container">
      {listError && <StatusBanner type="error">{listError}</StatusBanner>}
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
          <h3>Priority List ({priorityStore.visiblePriorities.length})</h3>
          <button
            className="btn-secondary toggle-description-btn"
            onClick={toggleDescription}
          >
            {showDescription ? <FaEyeSlash /> : <FaEye />}
            {showDescription ? "Hide" : "Show"} Descriptions
          </button>
        </div>

        {priorityStore.visiblePriorities.length === 0 ? (
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
          <>
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
                  {priorityStore.visiblePriorities
                    .slice(0, 10)
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
                onClick={() => priorityStore.goToPrev()}
                disabled={priorityStore.page <= 1}
                title="Previous page"
              >
                <FaChevronLeft />
                <span style={{ marginLeft: 6 }}>Previous</span>
              </button>
              <div>
                Page {priorityStore.page} of {priorityStore.totalPages}
              </div>
              <button
                className="btn-secondary"
                onClick={() => priorityStore.goToNext()}
                disabled={priorityStore.page >= priorityStore.totalPages}
                title="Next page"
              >
                <span style={{ marginRight: 6 }}>Next</span>
                <FaChevronRight />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default PriorityList;
