import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

const USER_CACHE_KEY = "user_token";
const USER_CACHE_DURATION = 24 * 30 * 60 * 60 * 1000; // 30 days
const USER_LOGIN_ROUTE = "/token";

let interceptorsInstalled = false;

export const userService = {
  // Persist token with timestamp
  setToken: (tokenValue) => {
    const record = {
      token: tokenValue,
      timestamp: Date.now(),
    };
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(record));
    return record;
  },

  // Return token if valid, else null
  getToken: () => {
    try {
      const raw = localStorage.getItem(USER_CACHE_KEY);
      if (!raw) return null;
      const record = JSON.parse(raw);
      const isExpired = userService.isTokenExpired(
        record?.expiresAt || record?.timestamp,
      );
      if (isExpired) {
        userService.clearToken();
        return null;
      }
      return record?.token || null;
    } catch (_e) {
      return null;
    }
  },

  // Persist token with extra metadata from auth response
  setTokenRecord: ({ token, tokenType, expiresAt }) => {
    const record = {
      token,
      tokenType: tokenType || "Bearer",
      // store server-side expiry if provided; fallback to 30d from now
      expiresAt: expiresAt
        ? Date.parse(expiresAt)
        : Date.now() + USER_CACHE_DURATION,
      timestamp: Date.now(),
    };
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(record));
    return record;
  },

  // Inspect full stored record (useful for debugging/UI)
  getTokenRecord: () => {
    try {
      const raw = localStorage.getItem(USER_CACHE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (_e) {
      return null;
    }
  },

  // Remove token from storage
  clearToken: () => {
    localStorage.removeItem(USER_CACHE_KEY);
  },

  // Whether provided epoch ms is in the past or beyond 30 days window
  isTokenExpired: (storedExpiryOrTimestamp) => {
    if (!storedExpiryOrTimestamp || typeof storedExpiryOrTimestamp !== "number")
      return true;
    // If value looks like an absolute expiry timestamp (in the future), compare directly
    if (storedExpiryOrTimestamp > Date.now() - 60 * 1000) {
      return Date.now() >= storedExpiryOrTimestamp;
    }
    // Else treat as stored-at timestamp and enforce 30d TTL
    return Date.now() - storedExpiryOrTimestamp > USER_CACHE_DURATION;
  },

  // Convenience: when you know header shape, apply it to apiClient
  // Example usage after API confirmation:
  // userService.applyTokenToClient({ headerName: 'Authorization', formatValue: (t) => `Bearer ${t}` })
  applyTokenToClient: ({ headerName, formatValue }) => {
    const token = userService.getToken();
    if (!token) return false;
    if (!headerName || typeof formatValue !== "function") return false;
    apiClient.defaults.headers.common[headerName] = formatValue(token);
    return true;
  },

  // Extract token fields from OAuth2-like response and persist
  extractAndStoreTokenFromResponse: (responseData) => {
    const accessToken = responseData?.access_token;
    const tokenType = responseData?.token_type; // expected "Bearer"
    const expiresAt = responseData?.expires_at; // datetime string
    if (!accessToken) {
      throw new Error("Token missing in response (expected 'access_token')");
    }
    const record = userService.setTokenRecord({
      token: accessToken,
      tokenType,
      expiresAt,
    });
    // Apply header immediately
    apiClient.defaults.headers.common["Authorization"] =
      `${record.tokenType || "Bearer"} ${record.token}`;
    return record;
  },

  // Generic login that posts to AUTH.TOKEN with caller-provided payload and content type.
  // Avoids assumptions about grant type or additional fields.
  loginRaw: async ({ data, contentType }) => {
    if (!data) throw new Error("loginRaw requires a data payload");
    const headers = {};
    let body = data;
    if (contentType) {
      headers["Content-Type"] = contentType;
      if (contentType === "application/x-www-form-urlencoded") {
        const params = new URLSearchParams();
        Object.entries(data).forEach(([k, v]) => params.append(k, String(v)));
        body = params;
      }
    }

    const resp = await apiClient.post(API_ENDPOINTS.AUTH.TOKEN, body, {
      headers,
    });
    if (resp.status === 200) {
      // Set the userkey to the local storage
      localStorage.setItem("user_key", resp.data.user_key);
      return userService.extractAndStoreTokenFromResponse(resp.data);
    } else {
      throw new Error("Login failed");
    }
  },

  getUserKey: () => {
    return localStorage.getItem("user_key");
  },

  // Attach axios interceptors to (1) inject Authorization header and (2) handle 401s
  installInterceptors: ({ loginPath = USER_LOGIN_ROUTE } = {}) => {
    if (interceptorsInstalled) return;
    interceptorsInstalled = true;

    // Request: inject Authorization if token available
    apiClient.interceptors.request.use((config) => {
      const token = userService.getToken();
      if (token) {
        config.headers = config.headers || {};
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
      return config;
    });

    // Response: on 401 clear token and redirect to login
    apiClient.interceptors.response.use(
      (resp) => resp,
      (error) => {
        const status = error?.response?.status;
        if (status === 401) {
          try {
            userService.clearToken();
          } finally {
            if (
              typeof window !== "undefined" &&
              window.location?.pathname !== loginPath
            ) {
              window.location.assign(loginPath);
            }
          }
        }
        return Promise.reject(error);
      },
    );
  },
};
