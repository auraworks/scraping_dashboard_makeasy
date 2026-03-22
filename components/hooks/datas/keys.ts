// React Query Keys for Data (Collected Data)
import type { Country } from "@/types/database";

export const dataKeys = {
  all: ["datas"] as const,
  lists: () => [...dataKeys.all, "list"] as const,
  list: (filters?: DataFilters) => [...dataKeys.lists(), filters] as const,
  details: () => [...dataKeys.all, "detail"] as const,
  detail: (id: number) => [...dataKeys.details(), id] as const,
  byDataId: (dataId: string) => [...dataKeys.all, "dataId", dataId] as const,
  bySource: (sourceId: number) => [...dataKeys.all, "source", sourceId] as const,
  countries: () => [...dataKeys.all, "countries"] as const,
  categories: () => [...dataKeys.all, "categories"] as const,
  sourcesForFilter: () => [...dataKeys.all, "sources-for-filter"] as const,
};

export interface DataFilters {
  country?: Country | "all";
  category?: string;
  sourceId?: number;
  search?: string;
  publishedAt?: string;
  page?: number;
  pageSize?: number;
}
