import { makeAutoObservable } from "mobx";
import { statusService } from "../services/statusService";

class StatusStore {
  statuses = [];
  loading = false;
  error = null;
  total = 0;
  page = 1;
  size = 50;

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(loading) {
    this.loading = loading;
  }

  setError(error) {
    this.error = error;
  }

  setStatuses(statuses) {
    this.statuses = statuses;
  }

  setTotal(total) {
    this.total = total;
  }

  setPage(page) {
    this.page = page;
  }

  addStatus(status) {
    this.statuses.push(status);
  }

  updateStatus(updatedStatus) {
    const index = this.statuses.findIndex((s) => s.key === updatedStatus.key);
    if (index !== -1) {
      this.statuses[index] = updatedStatus;
    }
  }

  removeStatus(key) {
    this.statuses = this.statuses.filter((s) => s.key !== key);
  }

  getStatusByKey(key) {
    return this.statuses.find((s) => s.key === key);
  }

  getDefaultStatus() {
    return this.statuses.find((s) => s.is_default);
  }

  async fetchStatuses(page = 1, size = 50) {
    try {
      this.setLoading(true);
      this.setError(null);
      const response = await statusService.getStatuses(page, size);
      this.setStatuses(response.statuses || []);
      this.setTotal(response.total || 0);
      this.setPage(page);
    } catch (error) {
      console.error("Error in fetchStatuses:", error);
      console.log("Error structure in store:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        code: error.code,
      });

      // Don't set error for 404 - this is handled gracefully by returning empty array
      if (error.response && error.response.status === 404) {
        console.log("404 error for statuses - handling gracefully");
        this.setStatuses([]);
        this.setTotal(0);
        this.setPage(page);
        this.setError(null); // Ensure no error is set
      } else {
        this.setError(error.message || "Failed to fetch statuses");
        console.error("Error fetching statuses:", error);
      }
    } finally {
      this.setLoading(false);
    }
  }

  async createStatus(statusData) {
    try {
      this.setLoading(true);
      this.setError(null);
      const response = await statusService.createStatus(statusData);
      this.addStatus(response);
      return response;
    } catch (error) {
      this.setError(error.message || "Failed to create status");
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async sendUpdateStatus(key, statusData) {
    try {
      this.setLoading(true);
      this.setError(null);
      const response = await statusService.updateStatus(key, statusData);
      this.updateStatus(response);
      return response;
    } catch (error) {
      this.setError(error.message || "Failed to update status");
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async deleteStatus(key) {
    try {
      this.setLoading(true);
      this.setError(null);
      await statusService.deleteStatus(key);
      this.removeStatus(key);
    } catch (error) {
      this.setError(error.message || "Failed to delete status");
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async reorderStatuses(key, fromOrder, toOrder) {
    try {
      this.setLoading(true);
      this.setError(null);
      await statusService.reorderStatuses(key, fromOrder, toOrder);
      // Refresh the list to get the updated order
      await this.fetchStatuses(this.page, this.size);
    } catch (error) {
      this.setError(error.message || "Failed to reorder statuses");
      throw error;
    } finally {
      this.setLoading(false);
    }
  }
}

export const statusStore = new StatusStore();
