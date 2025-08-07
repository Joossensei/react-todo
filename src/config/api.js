// src/config/api.js
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || "http://0.0.0.0:8000/api/v1",
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

export default API_CONFIG;
