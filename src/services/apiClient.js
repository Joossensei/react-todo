// src/services/apiClient.js
import axios from "axios";
import API_CONFIG from "../config/api";

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

// Request interceptor for logging and auth
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    if (error.response) {
      console.error("Response Data:", error.response.data);
    }
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize common error shapes into a user-friendly Error message
    const status = error?.response?.status;
    const serverData = error?.response?.data;
    const serverMessage =
      (typeof serverData === "string" && serverData) ||
      serverData?.detail ||
      serverData?.message ||
      serverData?.error ||
      null;

    let normalizedMessage = serverMessage || error?.message || "Request failed";

    if (!status) {
      // Network or CORS error
      normalizedMessage =
        "Cannot reach the server. Please check your connection and try again.";
    } else if (status >= 500) {
      normalizedMessage =
        "Something went wrong on our side. Please try again in a moment.";
    } else if (status === 404) {
      normalizedMessage =
        serverMessage || "The requested resource was not found.";
    } else if (status === 400) {
      normalizedMessage =
        serverMessage || "The request was invalid. Please check your input.";
    } else if (status === 401) {
      // Let existing auth interceptor handle redirect/cleanup; keep a clear message
      normalizedMessage = serverMessage || "Unauthorized";
    }

    const friendlyError = new Error(normalizedMessage);
    // Preserve axios error context for callers that need it
    friendlyError.name = error?.name || "AxiosError";
    friendlyError.code = error?.code;
    friendlyError.config = error?.config;
    friendlyError.response = error?.response;

    console.error("API Error:", {
      status,
      message: serverMessage || error?.message,
    });

    return Promise.reject(friendlyError);
  },
);

export default apiClient;
