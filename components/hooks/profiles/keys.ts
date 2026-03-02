// React Query Keys for Profiles (Users)
export const profileKeys = {
  all: ["profiles"] as const,
  lists: () => [...profileKeys.all, "list"] as const,
  list: (filters?: ProfileFilters) => [...profileKeys.lists(), filters] as const,
  details: () => [...profileKeys.all, "detail"] as const,
  detail: (id: string) => [...profileKeys.details(), id] as const,
  current: () => [...profileKeys.all, "current"] as const,
};

export interface ProfileFilters {
  role?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}
