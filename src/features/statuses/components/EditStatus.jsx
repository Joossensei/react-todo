import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams, useNavigate, Link } from "react-router";
import { FaArrowLeft, FaSave, FaTrash } from "react-icons/fa";
import { useStatuses } from "../hooks/useStatuses";
import { userService } from "../../users/services/userService";
import IconSelector from "../../priorities/components/IconSelector";
import "./styles/EditStatus.css";

const EditStatus = observer(() => {
  const { key } = useParams();
  const navigate = useNavigate();
  const { getStatusByKey, createStatus, sendUpdateStatus, deleteStatus } =
    useStatuses();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#667eea",
    icon: "fa-heart",
    is_default: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditing = key !== "new" && key !== undefined;

  useEffect(() => {
    if (isEditing) {
      const status = getStatusByKey(key);
      if (status) {
        setFormData({
          name: status.name,
          description: status.description || "",
          color: status.color,
          icon: status.icon,
          is_default: status.is_default,
        });
      }
    }
  }, [key, isEditing]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.color) {
      newErrors.color = "Color is required";
    }

    if (!formData.icon) {
      newErrors.icon = "Icon is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userKey = userService.getUserKey();
      if (!userKey) {
        throw new Error("User not authenticated");
      }

      const statusData = {
        ...formData,
        user_key: userKey,
        order: 1, // Will be set by backend
      };

      if (isEditing) {
        console.log("Updating key", key);
        console.log("statusData", statusData);
        await sendUpdateStatus(key, statusData);
      } else {
        await createStatus(statusData);
      }

      navigate("/statuses");
    } catch (error) {
      console.error("Error saving status:", error);
      setErrors({ submit: error.message || "Failed to save status" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;

    setLoading(true);
    try {
      await deleteStatus(key);
      navigate("/statuses");
    } catch (error) {
      console.error("Error deleting status:", error);
      setErrors({ delete: error.message || "Failed to delete status" });
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className="status-form">
      <div className="status-form-header">
        <Link to="/statuses" className="back-btn">
          <FaArrowLeft />
          Back to Statuses
        </Link>
        <h1>{isEditing ? "Edit Status" : "New Status"}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={errors.name ? "error" : ""}
            placeholder="Enter status name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Enter status description (optional)"
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="color">Color *</label>
            <div className="color-input-group">
              <input
                type="color"
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                className={errors.color ? "error" : ""}
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                className="color-text-input"
                placeholder="#667eea"
              />
            </div>
            {errors.color && (
              <span className="error-message">{errors.color}</span>
            )}
          </div>

          <div className="form-group">
            <label>Icon *</label>
            <IconSelector
              selectedIcon={formData.icon}
              onIconSelect={(icon) => handleInputChange("icon", icon)}
              className={errors.icon ? "error" : ""}
            />
            {errors.icon && (
              <span className="error-message">{errors.icon}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.is_default}
              onChange={(e) =>
                handleInputChange("is_default", e.target.checked)
              }
            />
            Set as default status
          </label>
          <span className="help-text">
            Default status will be automatically assigned to new todos
          </span>
        </div>

        {errors.submit && (
          <div className="error-banner">
            <p>{errors.submit}</p>
          </div>
        )}

        <div className="form-actions">
          {isEditing && (
            <button
              type="button"
              className="btn-danger"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
            >
              <FaTrash />
              Delete
            </button>
          )}
          <button type="submit" className="btn-primary" disabled={loading}>
            <FaSave />
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
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
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default EditStatus;
