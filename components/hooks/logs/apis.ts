import type { Log, PaginatedResponse } from "@/types/database";
import type { LogFilters } from "./types";

export async function getLogs(
  filters?: LogFilters,
): Promise<PaginatedResponse<Log>> {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.pageSize) params.set("pageSize", String(filters.pageSize));

  const response = await fetch(`/api/logs?${params.toString()}`);

  if (!response.ok) {
    return {
      data: [],
      total: 0,
      page: filters?.page || 1,
      pageSize: filters?.pageSize || 10,
      totalPages: 0,
    } as PaginatedResponse<Log>;
  }

  return response.json();
}
