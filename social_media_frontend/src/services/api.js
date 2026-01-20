//
// Lightweight API client for the frontend
//

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

/**
 * INTERNAL helper to build request options
 */
function buildOptions(method = "GET", data, extra = {}) {
  const headers = { "Content-Type": "application/json", ...(extra.headers || {}) };
  const opts = {
    method,
    headers,
    ...(data ? { body: JSON.stringify(data) } : {}),
  };
  return { ...opts, ...extra };
}

/**
 * INTERNAL fetch wrapper with error handling
 */
async function http(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  let payload = null;
  const isJson = res.headers.get("content-type")?.includes("application/json");
  try {
    payload = isJson ? await res.json() : await res.text();
  } catch (_) {
    payload = null;
  }
  if (!res.ok) {
    const message = (payload && payload.detail) || (typeof payload === "string" ? payload : "Request failed");
    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

// PUBLIC_INTERFACE
export const api = {
  /** Get health or version info from backend */
  // PUBLIC_INTERFACE
  async health() {
    return http("/health", buildOptions("GET"));
  },
  // PUBLIC_INTERFACE
  async getAnalytics() {
    return http("/analytics/summary", buildOptions("GET"));
  },
  // PUBLIC_INTERFACE
  async listUsers() {
    return http("/users", buildOptions("GET"));
  },
  // PUBLIC_INTERFACE
  async createUser(data) {
    return http("/users", buildOptions("POST", data));
  },
  // PUBLIC_INTERFACE
  async updateUser(id, data) {
    return http(`/users/${id}`, buildOptions("PUT", data));
  },
  // PUBLIC_INTERFACE
  async deleteUser(id) {
    return http(`/users/${id}`, buildOptions("DELETE"));
  },
  // PUBLIC_INTERFACE
  async getProfile(userId) {
    return http(`/profiles/${userId}`, buildOptions("GET"));
  },
  // PUBLIC_INTERFACE
  async updateProfile(userId, data) {
    return http(`/profiles/${userId}`, buildOptions("PUT", data));
  },
  // PUBLIC_INTERFACE
  async listPosts(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const suffix = qs ? `?${qs}` : "";
    return http(`/posts${suffix}`, buildOptions("GET"));
  },
  // PUBLIC_INTERFACE
  async createPost(data) {
    return http("/posts", buildOptions("POST", data));
  },
  // PUBLIC_INTERFACE
  async deletePost(id) {
    return http(`/posts/${id}`, buildOptions("DELETE"));
  },
};
