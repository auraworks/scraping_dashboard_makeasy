import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { categoryKeys } from "./keys";
import { getCategories } from "./apis";
import type { Category } from "./apis";
import type { ApiError } from "@/types/database";

// Use Categories List
export function useCategories(
  options?: Omit<
    UseQueryOptions<Category[], ApiError, Category[], ReturnType<typeof categoryKeys.lists>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: getCategories,
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
