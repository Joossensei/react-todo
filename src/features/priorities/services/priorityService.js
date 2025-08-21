import apiClient from "../../../services/apiClient";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

const PRIORITY_CACHE_KEY = "todo_priorities";
const PRIORITY_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const priorityService = {
  // Get priorities with caching (simple array, used by legacy hook/components)
  getPriorities: async () => {
    try {
      // Check cache first
      const cached = localStorage.getItem(PRIORITY_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > PRIORITY_CACHE_DURATION;

        if (!isExpired) {
          return data;
        }
      }

      // Fetch from API if cache is expired or doesn't exist
      const response = await apiClient.get(API_ENDPOINTS.PRIORITIES.LIST);

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

  // Get paginated priorities (used by MobX PriorityStore)
  getPrioritiesPaged: async ({ page = 1, size = 10 } = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRIORITIES.LIST, {
        params: { page, size },
      });
      // Expect { priorities, total, page, size, next_link, prev_link }
      return response.data;
    } catch (error) {
      console.error("Failed to fetch priorities (paged):", error);
      throw error;
    }
  },

  // Follow server-provided navigation link (next_link/prev_link)
  getPrioritiesByLink: async (link) => {
    if (!link) throw new Error("getPrioritiesByLink requires a link");
    try {
      const response = await apiClient.get(link);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch priorities via link:", error);
      throw error;
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

  // Patch priority
  patchPriority: async (id, priorityData) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.PRIORITIES.PATCH(id),
      priorityData,
    );
    // Invalidate cache after updating
    localStorage.removeItem(PRIORITY_CACHE_KEY);
    return response.data;
  },

  // Reorder priorities
  reorderPriorities: async (key, { fromOrder, toOrder }) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.PRIORITIES.REORDER(key),
      { fromOrder, toOrder },
    );

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

  // Get priority by key
  getPriority: async (key) => {
    const response = await apiClient.get(API_ENDPOINTS.PRIORITIES.GET(key));
    return response.data;
  },

  // Check availability
  checkAvailability: async (priorityData) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PRIORITIES.CHECK_AVAILABILITY,
      priorityData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
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
