// src/features/todos/utils/todoUtils.js

export const formatTodoText = (text) => text.trim();
export const validateTodo = (text) => text.trim().length > 0;

// Get available sort options
export const getSortOptions = () => [
  { value: "priority-desc", label: "Priority (High to Low)" },
  { value: "priority-desc-text-asc", label: "Priority + Alphabetical" },
  { value: "incomplete-priority-desc", label: "Incomplete + Priority" },
  { value: "text-asc", label: "Alphabetical (A-Z)" },
  { value: "text-desc", label: "Alphabetical (Z-A)" },
];
