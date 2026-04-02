import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { categoryKeys } from "./keys";
import { getCategories } from "./apis";
import type { Category } from "./apis";
import type { ApiError } from "@/types/database";

// useCategories()   → all categories
// useCategories(1)  → 유형1
// useCategories(2)  → 유형2
export function useCategories(
  type?: 1 | 2,
  options?: Omit<
    UseQueryOptions<Category[], ApiError, Category[], ReturnType<typeof categoryKeys.list>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: categoryKeys.list(type),
    queryFn: () => getCategories(type),
    ...options,
  });
}

// Use Category Detail (single category by ID)
export function useCategory(
  id: string,
  options?: Omit<
    UseQueryOptions<Category | null, ApiError, Category | null, ReturnType<typeof categoryKeys.detail>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const categories = await getCategories();
      return categories.find((c) => c.id === id) || null;
    },
    ...options,
  });
}
