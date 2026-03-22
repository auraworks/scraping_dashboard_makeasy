// Data Query Hooks
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { dataKeys, DataFilters } from "./keys";
import { getData, getDataById, getDataByDataId, getDataBySource, getCountries, getSourceCategories, getSourcesForFilter } from "./apis";
import type { DataWithSource, Country, PaginatedResponse, ApiError, Source } from "@/types/database";

// Use Data List with filters
export function useDataList(
  filters?: DataFilters,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<DataWithSource>, ApiError, PaginatedResponse<DataWithSource>, ReturnType<typeof dataKeys.list>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: dataKeys.list(filters),
    queryFn: () => getData(filters),
    ...options,
  });
}

// Use Data Detail by ID
export function useDataDetail(
  id: number,
  options?: Omit<
    UseQueryOptions<DataWithSource | null, ApiError, DataWithSource | null, ReturnType<typeof dataKeys.detail>>,
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

// Use Data Detail by data_id (UUID)
export function useDataByDataId(
  dataId: string,
  options?: Omit<
    UseQueryOptions<DataWithSource | null, ApiError, DataWithSource | null, ReturnType<typeof dataKeys.byDataId>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: dataKeys.byDataId(dataId),
    queryFn: () => getDataByDataId(dataId),
    enabled: !!dataId,
    ...options,
  });
}

// Use Data by Source
export function useDataBySource(
  sourceId: number,
  page = 1,
  pageSize = 10,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<DataWithSource>, ApiError, PaginatedResponse<DataWithSource>, ReturnType<typeof dataKeys.bySource>>,
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

// Use Countries list (for filter dropdown)
export function useCountries(
  options?: Omit<
    UseQueryOptions<Country[], ApiError, Country[], ReturnType<typeof dataKeys.countries>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: dataKeys.countries(),
    queryFn: getCountries,
    ...options,
  });
}

// Use Source Categories list (for filter dropdown)
export function useSourceCategories(
  options?: Omit<
    UseQueryOptions<string[], ApiError, string[], ReturnType<typeof dataKeys.categories>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: dataKeys.categories(),
    queryFn: getSourceCategories,
    ...options,
  });
}

// Use Sources list for filter dropdown (id + name)
export function useSourcesForFilter(
  options?: Omit<
    UseQueryOptions<Array<{ id: number; name: string | null; country: Country | null }>, ApiError, Array<{ id: number; name: string | null; country: Country | null }>, ReturnType<typeof dataKeys.sourcesForFilter>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: dataKeys.sourcesForFilter(),
    queryFn: getSourcesForFilter,
    ...options,
  });
}
