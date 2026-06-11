import { useCallback } from "react";
import { api } from "../api/client";
import { useApi } from "./useApi";

export function useNews() {
  const fetcher = useCallback(() => api.getNews(), []);
  const { data, loading, error, reload } = useApi(fetcher);
  return { news: data || [], loading, error, reload };
}
