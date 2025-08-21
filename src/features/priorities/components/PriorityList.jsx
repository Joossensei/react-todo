import React, { useEffect, useState } from "react";
// CSS
import "./styles/PriorityListing.css";
// Hooks
import { observer } from "mobx-react-lite";
import { useStores } from "../../../stores/RootStoreContext";
// Components
import EditPriority from "./EditPriority";
// Icons
import { getIconComponent } from "../../../constants/priorityIcons";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaEye,
  FaEyeSlash,
  FaChevronLeft,
  FaChevronRight,
  FaGripVertical,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import StatusBanner from "../../../components/ui/StatusBanner";
// DnD Kit
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Priority Row Component
const SortablePriorityRow = ({
  priority,
  showDescription,
  onEdit,
  onDelete,
  deletingPriority,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: priority.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className={isDragging ? "dragging" : ""}>
      <td className="order-cell">
        <div className="drag-handle" {...attributes} {...listeners}>
          <FaGripVertical />
        </div>
        <span className="order-badge">{priority.order}</span>
      </td>
      <td className="name-cell">
        {/* If the priority color is too dark for the background, use a lighter color */}
        <span className="priority-name" style={{ color: priority.color }}>
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
            onClick={() => onEdit(priority)}
            title="Edit priority"
          >
            <FaEdit />
          </button>
          <button
            className="btn-icon btn-delete"
            onClick={() => onDelete(priority)}
            disabled={deletingPriority === priority.key}
            title="Delete priority"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
};

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
  const [isReordering, setIsReordering] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  // Function to handle drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = priorityStore.visiblePriorities.findIndex(
        (priority) => priority.key === active.id,
      );
      const newIndex = priorityStore.visiblePriorities.findIndex(
        (priority) => priority.key === over.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        setIsReordering(true);
        try {
          // Send an update for the current priority
          const currentPriority = priorityStore.visiblePriorities[oldIndex];
          const newOrder = newIndex + 1;
          if (currentPriority.order !== newOrder) {
            await priorityStore.reorderPriorities(currentPriority.key, {
              fromOrder: currentPriority.order,
              toOrder: newOrder,
            });
          }
          // Refresh the priorities list to get the updated order
          await priorityStore.refetch(true);
        } catch (error) {
          console.error("Failed to reorder priorities:", error);
          setListError(
            error?.message || "Failed to reorder priorities. Please try again.",
          );
        } finally {
          setIsReordering(false);
        }
      }
    }
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

  // Sort priorities by order
  const sortedPriorities = [...priorityStore.visiblePriorities].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <div className="priority-listing-container">
      {listError && <StatusBanner type="error">{listError}</StatusBanner>}
      {isReordering && (
        <StatusBanner type="loading">Updating priority order...</StatusBanner>
      )}
      <div className="priority-listing-header">
        <div className="header-content">
          <h2>Priority Management</h2>
          <p>
            Manage your task priorities and their visual representations. Drag
            and drop to reorder.
          </p>
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
          <h3>Priority List ({sortedPriorities.length})</h3>
          <button
            className="btn-secondary toggle-description-btn"
            onClick={toggleDescription}
          >
            {showDescription ? <FaEyeSlash /> : <FaEye />}
            {showDescription ? "Hide" : "Show"} Descriptions
          </button>
        </div>

        {sortedPriorities.length === 0 ? (
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
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
                    <SortableContext
                      items={sortedPriorities.map((p) => p.key)}
                      strategy={verticalListSortingStrategy}
                    >
                      {sortedPriorities.map((priority) => (
                        <SortablePriorityRow
                          key={priority.key}
                          priority={priority}
                          showDescription={showDescription}
                          onEdit={handleEditClick}
                          onDelete={handlePriorityDelete}
                          deletingPriority={deletingPriority}
                        />
                      ))}
                    </SortableContext>
                  </tbody>
                </table>
              </DndContext>
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
