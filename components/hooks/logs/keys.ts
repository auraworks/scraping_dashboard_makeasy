import type { LogFilters } from "./types";

export const logKeys = {
  all: ["logs"] as const,
  lists: () => [...logKeys.all, "list"] as const,
  list: (filters?: LogFilters) => [...logKeys.lists(), filters] as const,
  details: () => [...logKeys.all, "detail"] as const,
  detail: (id: string) => [...logKeys.details(), id] as const,
};
