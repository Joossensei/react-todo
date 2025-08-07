import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

const PRIORITY_CACHE_KEY = "todo_priorities";
const PRIORITY_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const priorityService = {
  // Get priorities with caching
  getPriorities: async () => {
    console.log("Getting priorities");
    try {
      // Check cache first
      const cached = localStorage.getItem(PRIORITY_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > PRIORITY_CACHE_DURATION;

        if (!isExpired) {
          console.log("Using cached priorities");
          return data;
        }
      }

      // Fetch from API if cache is expired or doesn't exist
      console.log(
        "Fetching priorities from API (endpoint: ",
        API_ENDPOINTS.PRIORITIES.LIST,
        ")",
      );
      const response = await apiClient.get(API_ENDPOINTS.PRIORITIES.LIST);

      console.log("Priorities fetched from API:", response.data);
      const priorities = response.data.priorities;

      // Cache the result
      const cacheData = {
        data: priorities,
        timestamp: Date.now(),
      };
      localStorage.setItem(PRIORITY_CACHE_KEY, JSON.stringify(cacheData));

      return priorities;
    } catch (error) {
      console.error("Failed to fetch priorities:", error);

      // Fallback to default priorities if API fails
      return getDefaultPriorities();
    }
  },

  // Force refresh from API
  refreshPriorities: async () => {
    localStorage.removeItem(PRIORITY_CACHE_KEY);
    return await priorityService.getPriorities();
  },

  // Create new priority
  createPriority: async (priorityData) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PRIORITIES.CREATE,
      priorityData,
    );

    // Invalidate cache after creating new priority
    localStorage.removeItem(PRIORITY_CACHE_KEY);

    return response.data;
  },

  // Update priority
  updatePriority: async (id, priorityData) => {
    const response = await apiClient.put(
      API_ENDPOINTS.PRIORITIES.UPDATE(id),
      priorityData,
    );

    // Invalidate cache after updating
    localStorage.removeItem(PRIORITY_CACHE_KEY);

    return response.data;
  },

  // Delete priority
  deletePriority: async (id) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.PRIORITIES.DELETE(id),
    );

    // Invalidate cache after deleting
    localStorage.removeItem(PRIORITY_CACHE_KEY);

    return response.data;
  },
};

// Fallback default priorities
const getDefaultPriorities = () => [
  {
    key: "low",
    name: "Low",
    description: "Low priority",
    color: "#6b7280",
    icon: "fa-chevron-down",
    order: 1,
  },
  {
    key: "medium",
    name: "Medium",
    description: "Medium priority",
    color: "#f59e0b",
    icon: "fa-minus",
    order: 2,
  },
  {
    key: "high",
    name: "High",
    description: "High priority",
    color: "#ef4444",
    icon: "fa-chevron-up",
    order: 3,
  },
  {
    key: "urgent",
    name: "Urgent",
    description: "Urgent priority",
    color: "#dc2626",
    icon: "fa-exclamation-triangle",
    order: 4,
  },
];
