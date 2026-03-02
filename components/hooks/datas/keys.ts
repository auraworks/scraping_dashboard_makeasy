// React Query Keys for Data (Collected Data)
export const dataKeys = {
  all: ["datas"] as const,
  lists: () => [...dataKeys.all, "list"] as const,
  list: (filters?: DataFilters) => [...dataKeys.lists(), filters] as const,
  details: () => [...dataKeys.all, "detail"] as const,
  detail: (id: string) => [...dataKeys.details(), id] as const,
  bySource: (sourceId: number) => [...dataKeys.all, "source", sourceId] as const,
};

export interface DataFilters {
  country?: string;
  type?: string;
  sourceId?: number;
  search?: string;
  publishedAt?: string;
  page?: number;
  pageSize?: number;
}
