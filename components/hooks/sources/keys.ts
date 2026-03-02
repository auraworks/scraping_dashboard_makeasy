// React Query Keys for Sources (Information Sources)
import type { Country } from "@/types/database";

export const sourceKeys = {
  all: ["sources"] as const,
  lists: () => [...sourceKeys.all, "list"] as const,
  list: (filters?: SourceFilters) => [...sourceKeys.lists(), filters] as const,
  details: () => [...sourceKeys.all, "detail"] as const,
  detail: (id: number) => [...sourceKeys.details(), id] as const,
  bySourceId: (sourceId: string) => [...sourceKeys.all, "sourceId", sourceId] as const,
};

export interface SourceFilters {
  country?: Country | "all";
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}
