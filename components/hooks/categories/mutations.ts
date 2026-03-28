import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { insertCategory, updateCategory, deleteCategory } from "./apis";
import { categoryKeys } from "./keys";
import type { Category } from "./apis";
import type { ApiError } from "@/types/database";

interface AddCategoryInput {
  name: string;
  parentId?: string | null;
}

// Add Category Mutation
export function useAddCategory(
  options?: Omit<
    UseMutationOptions<Category, ApiError, AddCategoryInput>,
    "mutationFn" | "onSuccess"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, parentId }: AddCategoryInput) =>
      insertCategory(name, parentId),
    onSuccess: () => {
      // Invalidate all category list queries (all parentId variants)
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    ...options,
  });
}

// Rename Category Mutation
export function useRenameCategory(
  options?: Omit<
    UseMutationOptions<void, ApiError, { id: string; newName: string }>,
    "mutationFn" | "onSuccess"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newName }) => updateCategory(id, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    ...options,
  });
}

// Delete Category Mutation (CASCADE removes children)
export function useDeleteCategory(
  options?: Omit<
    UseMutationOptions<void, ApiError, string>,
    "mutationFn" | "onSuccess"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      // Invalidate all lists so both 유형1 and 유형2 refresh
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    ...options,
  });
}
