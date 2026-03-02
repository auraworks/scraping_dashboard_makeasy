// Data Mutation Hooks
import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { createData, updateData, deleteData } from "./apis";
import { dataKeys } from "./keys";
import type { Data, ApiError } from "@/types/database";

// Create Data Mutation
export function useCreateData(
  options?: Omit<
    UseMutationOptions<Data, ApiError, Omit<Data, "id" | "created_at">>,
    "mutationFn" | "onSuccess"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataKeys.lists() });
    },
    ...options,
  });
}

// Update Data Mutation
export function useUpdateData(
  options?: Omit<
    UseMutationOptions<Data, ApiError, { id: string; updates: Partial<Omit<Data, "id" | "created_at">> }>,
    "mutationFn" | "onSuccess"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => updateData(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: dataKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dataKeys.detail(data.id) });
    },
    ...options,
  });
}

// Delete Data Mutation
export function useDeleteData(
  options?: Omit<
    UseMutationOptions<void, ApiError, string>,
    "mutationFn" | "onSuccess"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteData,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: dataKeys.lists() });
      queryClient.removeQueries({ queryKey: dataKeys.detail(id) });
    },
    ...options,
  });
}
