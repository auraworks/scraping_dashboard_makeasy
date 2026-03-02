// Data Query Hooks
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { dataKeys, DataFilters } from "./keys";
import { getData, getDataById, getDataBySource } from "./apis";
import type { Data, PaginatedResponse, ApiError } from "@/types/database";

// Use Data List with filters
export function useDataList(
  filters?: DataFilters,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Data>, ApiError, PaginatedResponse<Data>, ReturnType<typeof dataKeys.list>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: dataKeys.list(filters),
    queryFn: () => getData(filters),
    ...options,
  });
}

// Use Data Detail
export function useDataDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<Data | null, ApiError, Data | null, ReturnType<typeof dataKeys.detail>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: dataKeys.detail(id),
    queryFn: () => getDataById(id),
    enabled: !!id,
    ...options,
  });
}

// Use Data by Source
export function useDataBySource(
  sourceId: number,
  page = 1,
  pageSize = 10,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Data>, ApiError, PaginatedResponse<Data>, ReturnType<typeof dataKeys.bySource>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: dataKeys.bySource(sourceId),
    queryFn: () => getDataBySource(sourceId, page, pageSize),
    enabled: !!sourceId,
    ...options,
  });
}
