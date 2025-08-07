import React, { useState } from "react";
import "./IconSelector.css";
import {
  PRIORITY_ICONS,
  getIconsByCategory,
  getIconCategories,
  getIconComponent,
  getIconName,
} from "../../constants/priorityIcons";

const IconSelector = ({
  selectedIcon,
  onIconSelect,
  className = "",
  showCategories = true,
  maxDisplayedIcons = 20,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = getIconCategories();

  // Filter icons based on category and search term
  const getFilteredIcons = () => {
    let icons =
      selectedCategory === "all"
        ? PRIORITY_ICONS
        : getIconsByCategory(selectedCategory);

    if (searchTerm) {
      icons = Object.entries(icons)
        .filter(
          ([key, data]) =>
            data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            key.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .reduce((acc, [key, data]) => {
          acc[key] = data;
          return acc;
        }, {});
    }

    return icons;
  };

  const filteredIcons = getFilteredIcons();
  const iconEntries = Object.entries(filteredIcons);

  // Limit displayed icons for performance
  const displayedIcons = iconEntries.slice(0, maxDisplayedIcons);
  const hasMoreIcons = iconEntries.length > maxDisplayedIcons;

  const handleIconSelect = (iconKey) => {
    onIconSelect(iconKey);
    setIsOpen(false);
    setSearchTerm("");
  };

  const SelectedIconComponent = selectedIcon
    ? getIconComponent(selectedIcon)
    : null;

  return (
    <div className={`icon-selector ${className}`}>
      {/* Selected Icon Display / Trigger Button */}
      <button
        type="button"
        className="icon-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title={
          selectedIcon
            ? `Selected: ${getIconName(selectedIcon)}`
            : "Select an icon"
        }
      >
        {SelectedIconComponent ? (
          <SelectedIconComponent />
        ) : (
          <span className="no-icon-placeholder">?</span>
        )}
        <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="icon-selector-dropdown">
          {/* Search */}
          <div className="icon-search">
            <input
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="icon-search-input"
            />
          </div>

          {/* Category Filter */}
          {showCategories && (
            <div className="icon-categories">
              <button
                className={`category-btn ${selectedCategory === "all" ? "active" : ""}`}
                onClick={() => setSelectedCategory("all")}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* Icon Grid */}
          <div className="icon-grid">
            {displayedIcons.length === 0 ? (
              <div className="no-icons-message">
                No icons found{searchTerm && ` for "${searchTerm}"`}
              </div>
            ) : (
              <>
                {displayedIcons.map(([iconKey, iconData]) => {
                  const IconComponent = iconData.component;
                  const isSelected = selectedIcon === iconKey;

                  return (
                    <button
                      key={iconKey}
                      type="button"
                      className={`icon-option ${isSelected ? "selected" : ""}`}
                      onClick={() => handleIconSelect(iconKey)}
                      title={iconData.name}
                    >
                      <IconComponent />
                    </button>
                  );
                })}
                {hasMoreIcons && (
                  <div className="more-icons-indicator">
                    +{iconEntries.length - maxDisplayedIcons} more...
                    <br />
                    <small>Use search to find specific icons</small>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Selected Info */}
          {selectedIcon && (
            <div className="selected-icon-info">
              <strong>Selected:</strong> {getIconName(selectedIcon)}
              <br />
              <small>Key: {selectedIcon}</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IconSelector;
