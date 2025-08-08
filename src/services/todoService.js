// src/services/todoService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
// Cache
const TODO_CACHE_KEY = "todo_todos";
const TODO_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const todoService = {
  // Get all todos
  getTodos: async () => {
    try {
      // Check cache first
      const cached = localStorage.getItem(TODO_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > TODO_CACHE_DURATION;

        if (!isExpired) {
          return data;
        }
      }

      // Fetch from API if cache is expired or doesn't exist
      const response = await apiClient.get(API_ENDPOINTS.TODOS.LIST);
      const todos = response.data.todos;

      // Cache the result
      const cacheData = {
        data: todos,
        timestamp: Date.now(),
      };
      localStorage.setItem(TODO_CACHE_KEY, JSON.stringify(cacheData));

      return todos;
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      throw error;
    }
  },

  // Force refresh from API
  refreshTodos: async () => {
    localStorage.removeItem(TODO_CACHE_KEY);
    return await todoService.getTodos();
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
