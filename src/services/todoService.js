// src/services/todoService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const todoService = {
  // Get paginated todos with server-side sort/filter
  getTodos: async ({ page = 1, size = 10, sort, completed, priority } = {}) => {
    try {
      const params = { page, size };
      if (sort) params.sort = sort;
      if (typeof completed === "boolean") params.completed = completed;
      if (priority) params.priority = priority;

      const response = await apiClient.get(API_ENDPOINTS.TODOS.LIST, {
        params,
      });
      // Expect { todos, total, page, size, success, next_link, prev_link }
      return response.data;
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      throw error;
    }
  },

  // Follow server-provided navigation link (next_link/prev_link)
  getTodosByLink: async (link) => {
    if (!link) throw new Error("getTodosByLink requires a link");
    try {
      const response = await apiClient.get(link);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch todos via link:", error);
      throw error;
    }
  },

  // Create new todo
  createTodo: async (todoData) => {
    const response = await apiClient.post(API_ENDPOINTS.TODOS.CREATE, todoData);
    return response.data;
  },

  // Get single todo
  getTodo: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.TODOS.GET(id));
    return response.data;
  },

  // Update todo
  updateTodo: async (id, todoData) => {
    const response = await apiClient.put(
      API_ENDPOINTS.TODOS.UPDATE(id),
      todoData,
    );
    return response.data;
  },

  // Patch todo
  patchTodo: async (id, todoData) => {
    console.log("patching todo", id, todoData);
    const response = await apiClient.patch(
      API_ENDPOINTS.TODOS.PATCH(id),
      todoData,
    );
    return response.data;
  },

  // Delete todo
  deleteTodo: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.TODOS.DELETE(id));
    return response.data;
  },
};
