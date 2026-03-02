import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { insertCategory, updateCategory, deleteCategory } from "./apis";
import { categoryKeys } from "./keys";
import type { Category } from "./apis";
import type { ApiError } from "@/types/database";

// Add Category Mutation
export function useAddCategory(
  options?: Omit<
    UseMutationOptions<Category, ApiError, string>,
    "mutationFn" | "onSuccess"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: insertCategory,
    onSuccess: () => {
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

// Delete Category Mutation
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
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    ...options,
  });
}
