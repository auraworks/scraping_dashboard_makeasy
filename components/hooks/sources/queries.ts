// Source Query Hooks
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { sourceKeys, SourceFilters } from "./keys";
import { getSources, getSourceById } from "./apis";
import type { Source, PaginatedResponse, ApiError } from "@/types/database";

// Use Sources List with filters
export function useSourceList(
  filters?: SourceFilters,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Source>, ApiError, PaginatedResponse<Source>, ReturnType<typeof sourceKeys.list>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: sourceKeys.list(filters),
    queryFn: () => getSources(filters),
    ...options,
  });
}

// Use Source Detail
export function useSourceDetail(
  id: number,
  options?: Omit<
    UseQueryOptions<Source | null, ApiError, Source | null, ReturnType<typeof sourceKeys.detail>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: sourceKeys.detail(id),
    queryFn: () => getSourceById(id),
    enabled: !!id,
    ...options,
  });
}
