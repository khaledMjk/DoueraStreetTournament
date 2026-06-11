import { useCallback } from "react";
import { api } from "../api/client";
import { useApi } from "./useApi";

export function useMatches(params = {}) {
  const key = JSON.stringify(params);
  const fetcher = useCallback(() => api.getMatches(params), [key]);
  const { data, loading, error, reload } = useApi(fetcher, [key]);
  return { matches: data || [], loading, error, reload };
}
