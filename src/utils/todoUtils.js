// src/utils/todoUtils.js

export const formatTodoText = (text) => text.trim();
export const validateTodo = (text) => text.trim().length > 0;
export const generateTodoId = (todos) =>
  Math.max(...todos.map((t) => t.id), 0) + 1;
