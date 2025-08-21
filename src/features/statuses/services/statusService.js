import apiClient from "../../../services/apiClient";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

const STATUS_CACHE_KEY = "todo_statuses";
const STATUS_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

class StatusService {
  async getStatuses(page = 1, size = 50) {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.STATUS.LIST}?page=${page}&size=${size}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching statuses:", error);
      console.log("Error structure:", {
        message: error.message,
        code: error.code,
      });

      // Handle 404 gracefully by returning empty statuses
      if (error.message.message && error.message.message.includes("404")) {
        console.log(
          "Statuses endpoint not found (404) - returning empty array",
        );
        return {
          statuses: [],
          total: 0,
          page: page,
          size: 0,
          success: true,
          next_link: null,
          prev_link: null,
        };
      }
      // For other errors, throw them
      throw error;
    }
  }

  async getStatus(key) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.STATUS.GET(key)}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching status:", error);
      throw error;
    }
  }

  async createStatus(statusData) {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.STATUS.CREATE}`,
        statusData,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating status:", error);
      throw error;
    }
  }

  async updateStatus(key, statusData) {
    try {
      const response = await apiClient.put(
        `${API_ENDPOINTS.STATUS.UPDATE(key)}`,
        statusData,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating status:", error);
      throw error;
    }
  }

  async patchStatus(key, statusData) {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.STATUS.PATCH(key)}`,
        statusData,
      );
      return response.data;
    } catch (error) {
      console.error("Error patching status:", error);
      throw error;
    }
  }

  async deleteStatus(key) {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.STATUS.DELETE(key)}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting status:", error);
      throw error;
    }
  }

  async reorderStatuses(key, fromOrder, toOrder) {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.STATUS.REORDER(key)}`,
        {
          fromOrder,
          toOrder,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error reordering statuses:", error);
      throw error;
    }
  }

  // Force refresh from API
  async refreshStatuses() {
    localStorage.removeItem(STATUS_CACHE_KEY);
    return await this.getStatuses();
  }
}

export const statusService = new StatusService();
