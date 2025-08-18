export const API_ENDPOINTS = {
  TODOS: {
    LIST: "/todos",
    CREATE: "/todo",
    GET: (key) => `/todo/${key}`,
    UPDATE: (key) => `/todo/${key}`,
    DELETE: (key) => `/todo/${key}`,
    PATCH: (key) => `/todo/${key}`,
  },
  PRIORITIES: {
    LIST: "/priorities",
    CREATE: "/priority",
    GET: (key) => `/priority/${key}`,
    UPDATE: (key) => `/priority/${key}`,
    DELETE: (key) => `/priority/${key}`,
    PATCH: (key) => `/priority/${key}`,
  },
  USER: {
    LIST: "/users",
    CREATE: "/user",
    UPDATE: (key) => `/user/${key}`,
    UPDATE_PASSWORD: (key) => `/user/${key}/password`,
    DELETE: (key) => `/user/${key}`,
    GET: (key) => `/user/${key}`,
  },
  AUTH: {
    TOKEN: "/token",
    FORGOT_PASSWORD: (key) => `/user/${key}/reset-password`,
  },
  GENERAL: {
    HEALTH: "/health",
  },
};
