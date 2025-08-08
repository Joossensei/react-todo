import React, { useState } from "react";
import "./PriorityForm.css";
import IconSelector from "../IconSelector";
import { DEFAULT_PRIORITY_ICON_MAPPING } from "../../constants/priorityIcons";

const EditPriority = ({ priority = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: priority?.name || "",
    description: priority?.description || "",
    color: priority?.color || "#6b7280",
    icon: priority?.icon || DEFAULT_PRIORITY_ICON_MAPPING.medium,
    order: priority?.order || 1,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.color.trim()) {
      newErrors.color = "Color is required";
    }

    if (formData.order < 1) {
      newErrors.order = "Order must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

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
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {priority ? "Update Priority" : "Create Priority"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPriority;
