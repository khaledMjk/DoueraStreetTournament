import { useCallback } from "react";
import { api } from "../api/client";
import { useApi } from "./useApi";

export function useTeams() {
  const fetcher = useCallback(() => api.getTeams(), []);
  const { data, loading, error, reload } = useApi(fetcher);
  return { teams: data || [], loading, error, reload };
}
