// src/services/todoService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const todoService = {
  // Get all todos
  getTodos: async () => {
    const response = await apiClient.get(API_ENDPOINTS.TODOS.LIST);
    return response.data;
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

  // Delete todo
  deleteTodo: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.TODOS.DELETE(id));
    return response.data;
  },
};
