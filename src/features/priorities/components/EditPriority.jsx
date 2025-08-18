import React, { useState, useEffect } from "react";
import "./styles/EditPriority.css";
import IconSelector from "./../components/IconSelector";
import { DEFAULT_PRIORITY_ICON_MAPPING } from "../../../constants/priorityIcons";
import { useNavigate, useParams } from "react-router";
import { priorityService } from "../services/priorityService";
import { useStores } from "../../../stores/RootStoreContext";
import { userService } from "../../users/services/userService";

const EditPriority = () => {
  const navigate = useNavigate();
  const { priorityStore } = useStores();
  const { id } = useParams();
  const priorityKey = id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#6b7280",
    icon: DEFAULT_PRIORITY_ICON_MAPPING.medium,
    order: 1,
  });

  useEffect(() => {
    const fetchPriority = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!priorityKey) {
          setFormData({
            name: "",
            description: "",
            color: "#6b7280",
            icon: DEFAULT_PRIORITY_ICON_MAPPING.medium,
            order: 1,
          });
        } else {
          const data = await priorityService.getPriority(priorityKey);
          setFormData({
            name: data?.name || "",
            description: data?.description || "",
            color: data?.color || "#6b7280",
            icon: data?.icon || DEFAULT_PRIORITY_ICON_MAPPING.medium,
            order: data?.order || 1,
          });
        }
      } catch (err) {
        setError(err?.message || "Failed to fetch priority");
      } finally {
        setLoading(false);
      }
    };
    fetchPriority();
  }, [priorityKey]);

  // State for form validation errors
  const [errors, setErrors] = useState({});

  const isValidColor = (color) => {
    // Check if color is a valid hex color
    const hexRegex = /^#([0-9A-Fa-f]{6})$/;
    return hexRegex.test(color);
  };

  // Validate form data before saving
  const validateForm = async () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.color.trim()) {
      newErrors.color = "Color is required";
    }

    // Filter out invalid colors
    if (!isValidColor(formData.color)) {
      newErrors.color = "Invalid color format";
    }

    if (formData.order < 1) {
      newErrors.order = "Order must be at least 1";
    }

    formData.user_key = userService.getUserKey();
    formData.key = priorityKey;

    // Set errors and return true if no errors
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();

    // Validate form data before saving
    if (await validateForm()) {
      formData.user_key = userService.getUserKey();
      try {
        let response;
        if (priorityKey) {
          response = await priorityService.updatePriority(
            priorityKey,
            formData,
          );
        } else {
          response = await priorityService.createPriority(formData);
        }

        if (response.key || response.success) {
          // Ensure the list reflects latest changes when we navigate back
          await priorityStore.refetch(true);
          navigate(-1);
        } else {
        }
      } catch (err) {
        const response = err.response;
        const newErrors = {};
        if (response.data.detail.includes("Name")) {
          newErrors.name = response.data.detail;
        } else if (response.data.detail.includes("order")) {
          newErrors.order = response.data.detail;
        } else {
          newErrors.name = response.data.detail;
        }
        setErrors(newErrors);
      }
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  if (loading) {
    return (
      <div className="priority-form">
        <div className="form-header">
          <h2>{priorityKey ? "Edit Priority" : "Create Priority"}</h2>
        </div>
        <div style={{ marginBottom: 8 }}>
          <span> </span>
        </div>
        <div>
          <span>Loading…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="priority-form">
        <div className="form-header">
          <h2>{priorityKey ? "Edit Priority" : "Create Priority"}</h2>
        </div>
        <div className="form-errors" role="alert" style={{ marginBottom: 8 }}>
          {error}
        </div>
      </div>
    );
  }

  // Render the form
  return (
    <div className="priority-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Priority Name *</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={errors.name ? "error" : ""}
            placeholder="e.g., High Priority"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Optional description for this priority"
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="color">Color *</label>
            <div className="color-input-group">
              <input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                className={errors.color ? "error" : ""}
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                className={`color-text-input ${errors.color ? "error" : ""}`}
                placeholder="#000000"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
            {errors.color && (
              <span className="error-message">{errors.color}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="order">Order *</label>
            <input
              id="order"
              type="number"
              min="1"
              value={formData.order}
              onChange={(e) =>
                handleInputChange("order", parseInt(e.target.value, 10) || 1)
              }
              className={errors.order ? "error" : ""}
            />
            {errors.order && (
              <span className="error-message">{errors.order}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Icon</label>
          <IconSelector
            selectedIcon={formData.icon}
            onIconSelect={(iconKey) => handleInputChange("icon", iconKey)}
            className="priority-icon-selector"
          />
          <small className="help-text">
            Choose an icon to represent this priority level
          </small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {priorityKey ? "Update Priority" : "Create Priority"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPriority;
