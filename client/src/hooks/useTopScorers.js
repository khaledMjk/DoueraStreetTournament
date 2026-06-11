import { useCallback } from "react";
import { api } from "../api/client";
import { useApi } from "./useApi";

export function useTopScorers(limit = 10) {
  const fetcher = useCallback(() => api.getTopScorers(limit), [limit]);
  const { data, loading, error, reload } = useApi(fetcher, [limit]);
  return { scorers: data || [], loading, error, reload };
}
