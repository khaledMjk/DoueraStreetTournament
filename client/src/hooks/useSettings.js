import { useCallback } from "react";
import { api } from "../api/client";
import { useApi } from "./useApi";

export function useSettings() {
  const fetcher = useCallback(() => api.getSettings(), []);
  const { data, loading, error, reload } = useApi(fetcher);
  return { settings: data, loading, error, reload };
}
