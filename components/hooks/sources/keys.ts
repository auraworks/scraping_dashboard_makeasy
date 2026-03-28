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
  categoryParent?: string; // 유형1 ID: 해당 유형1의 모든 하위 유형2를 필터링
  search?: string;
  page?: number;
  pageSize?: number;
}
