const JSON_HEADERS = { "Content-Type": "application/json" };

export function getStoredToken() {
  return localStorage.getItem("token");
}

export function setStoredToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

/**
 * @param {string} path e.g. /api/projects
 * @param {RequestInit} options
 */
export async function api(path, options = {}) {
  const headers = { ...JSON_HEADERS, ...options.headers };
  const token = getStoredToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });
  const data =
    res.status === 204
      ? {}
      : await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.message || res.statusText || "Request failed";
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data;
}
