import { useCallback } from "react";
import { api } from "../api/client";
import { useApi } from "./useApi";

export function useGroups() {
  const fetcher = useCallback(() => api.getGroups(), []);
  const { data, loading, error, reload } = useApi(fetcher);
  return { groups: data || [], loading, error, reload };
}
