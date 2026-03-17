import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { logKeys } from "./keys";
import { getLogs, getLogById } from "./apis";
import type { Log, PaginatedResponse, ApiError } from "@/types/database";
import type { LogFilters } from "./types";

export function useLogList(
  filters?: LogFilters,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Log>, ApiError, PaginatedResponse<Log>, ReturnType<typeof logKeys.list>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: logKeys.list(filters),
    queryFn: () => getLogs(filters),
    ...options,
  });
}

export function useLogDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<Log | null, ApiError, Log | null, ReturnType<typeof logKeys.detail>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: logKeys.detail(id),
    queryFn: () => getLogById(id),
    ...options,
  });
}
