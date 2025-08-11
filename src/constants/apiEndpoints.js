export const API_ENDPOINTS = {
  TODOS: {
    LIST: "/todos/",
    CREATE: "/todos/",
    GET: (key) => `/todos/${key}/`,
    UPDATE: (key) => `/todos/${key}/`,
    DELETE: (key) => `/todos/${key}/`,
    PATCH: (key) => `/todos/${key}/`,
  },
  PRIORITIES: {
    LIST: "/priorities/", // ← Add trailing slash
    CREATE: "/priorities/",
    GET: (key) => `/priorities/${key}/`,
    UPDATE: (key) => `/priorities/${key}/`,
    DELETE: (key) => `/priorities/${key}/`,
    CHECK_AVAILABILITY: `/priorities/util/check-availability`,
  },
  USER: {
    LIST: "/users/",
    CREATE: "/users/",
    UPDATE: (key) => `/users/${key}/`,
    DELETE: (key) => `/users/${key}/`,
    GET: (key) => `/users/${key}/`,
    CURRENT: "/users/me/",
  },
  AUTH: {
    TOKEN: "/token/",
    FORGOT_PASSWORD: (key) => `/users/${key}/reset-password/`,
  },
};
