const STATIC_MODE = import.meta.env.VITE_STATIC_DATA === "true";
const API_BASE = "/api";
const STATIC_BASE = `${import.meta.env.BASE_URL}data`;

async function request(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
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

  return res.json();
}

async function staticRequest(file) {
  const res = await fetch(`${STATIC_BASE}/${file}`);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

function filterMatches(matches, { group, status, teamId } = {}) {
  let result = matches;
  if (group) result = result.filter((m) => m.group === group);
  if (status) result = result.filter((m) => m.status === status);
  if (teamId) {
    result = result.filter((m) => m.homeTeamId === teamId || m.awayTeamId === teamId);
  }
  return result;
}

// Read-only public API. Data is maintained by hand in server/data/*.json and,
// for the static deployment, pre-exported to the client build.
const liveApi = {
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
};

// Static deployments (e.g. GitHub Pages) have no backend: serve pre-exported JSON.
const staticApi = {
  getSettings: () => staticRequest("settings.json"),
  getTeams: () => staticRequest("teams.json"),
  getTeam: (id) => staticRequest(`teams/${id}.json`),
  getGroups: () => staticRequest("groups.json"),
  getMatches: (params = {}) => staticRequest("matches.json").then((matches) => filterMatches(matches, params)),
  getTopScorers: (limit = 10) => staticRequest("topscorers.json").then((rows) => rows.slice(0, limit)),
  getNews: () => staticRequest("news.json"),
};

export const api = STATIC_MODE ? staticApi : liveApi;
