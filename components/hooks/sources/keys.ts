// React Query Keys for Sources (Information Sources)
export const sourceKeys = {
  all: ["sources"] as const,
  lists: () => [...sourceKeys.all, "list"] as const,
  list: (filters?: SourceFilters) => [...sourceKeys.lists(), filters] as const,
  details: () => [...sourceKeys.all, "detail"] as const,
  detail: (id: number) => [...sourceKeys.details(), id] as const,
};

export interface SourceFilters {
  country?: string;
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}
