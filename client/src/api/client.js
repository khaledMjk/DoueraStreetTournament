const BASE_URL = "/api";

function getToken() {
  return localStorage.getItem("douera_token");
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `Erreur ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Public endpoints
  getSettings: () => request("/settings"),
  getTeams: () => request("/teams"),
  getTeam: (id) => request(`/teams/${id}`),
  getGroups: () => request("/groups"),
  getMatches: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/matches${qs ? `?${qs}` : ""}`);
  },
  getTopScorers: (limit = 10) => request(`/stats/topscorers?limit=${limit}`),
  getNews: () => request("/news"),

  // Auth
  login: (username, password) =>
    request("/auth/login", { method: "POST", body: { username, password } }),

  // Admin: teams
  createTeam: (data) => request("/teams", { method: "POST", body: data, auth: true }),
  updateTeam: (id, data) => request(`/teams/${id}`, { method: "PUT", body: data, auth: true }),
  deleteTeam: (id) => request(`/teams/${id}`, { method: "DELETE", auth: true }),

  // Admin: groups
  createGroup: (data) => request("/groups", { method: "POST", body: data, auth: true }),
  updateGroup: (id, data) => request(`/groups/${id}`, { method: "PUT", body: data, auth: true }),
  deleteGroup: (id) => request(`/groups/${id}`, { method: "DELETE", auth: true }),

  // Admin: matches
  createMatch: (data) => request("/matches", { method: "POST", body: data, auth: true }),
  updateMatch: (id, data) => request(`/matches/${id}`, { method: "PUT", body: data, auth: true }),
  deleteMatch: (id) => request(`/matches/${id}`, { method: "DELETE", auth: true }),

  // Admin: news
  createNews: (data) => request("/news", { method: "POST", body: data, auth: true }),
  updateNews: (id, data) => request(`/news/${id}`, { method: "PUT", body: data, auth: true }),
  deleteNews: (id) => request(`/news/${id}`, { method: "DELETE", auth: true }),

  // Admin: settings
  updateSettings: (data) => request("/settings", { method: "PUT", body: data, auth: true }),
};
