export const API_ENDPOINTS = {
  TODOS: {
    LIST: "/todos/",
    CREATE: "/todos/",
    GET: (id) => `/todos/${id}/`,
    UPDATE: (id) => `/todos/${id}/`,
    DELETE: (id) => `/todos/${id}/`,
    PATCH: (id) => `/todos/${id}/`,
  },
  PRIORITIES: {
    LIST: "/priorities/", // ← Add trailing slash
    CREATE: "/priorities/",
    GET: (id) => `/priorities/${id}/`,
    UPDATE: (id) => `/priorities/${id}/`,
    DELETE: (id) => `/priorities/${id}/`,
    CHECK_AVAILABILITY: `/priorities/util/check-availability`,
  },
};
