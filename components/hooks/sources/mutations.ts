// Source Mutation Hooks
import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import {
  createSource,
  updateSource,
  deleteSource,
  bulkUpdateSourceStatus,
} from "./apis";
import { sourceKeys } from "./keys";
import type { Source, ApiError } from "@/types/database";

// Create Source Mutation
export function useCreateSource(
  options?: UseMutationOptions<Source, ApiError, Omit<Source, "id" | "created_at">>
) {
  const queryClient = useQueryClient();

  return useMutation<Source, ApiError, Omit<Source, "id" | "created_at">>({
    mutationFn: createSource,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: sourceKeys.lists() });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      options?.onError?.(error, variables, onMutateResult, context);
    },
  });
}

// Update Source Mutation
export function useUpdateSource(
  options?: UseMutationOptions<
      Source,
      ApiError,
      { id: number; updates: Partial<Omit<Source, "id" | "created_at">> }
    >
) {
  const queryClient = useQueryClient();

  return useMutation<Source, ApiError, { id: number; updates: Partial<Omit<Source, "id" | "created_at">> }>({
    mutationFn: ({ id, updates }) => updateSource(id, updates),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: sourceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sourceKeys.detail(variables.id) });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      options?.onError?.(error, variables, onMutateResult, context);
    },
  });
}

// Bulk Update Source Status Mutation
export function useBulkUpdateSourceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, isLive }: { ids: number[]; isLive: boolean }) =>
      bulkUpdateSourceStatus(ids, isLive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sourceKeys.lists() });
    },
  });
}

// Delete Source Mutation
export function useDeleteSource(
  options?: Omit<
    UseMutationOptions<void, ApiError, number>,
    "mutationFn" | "onSuccess"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSource,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: sourceKeys.lists() });
      queryClient.removeQueries({ queryKey: sourceKeys.detail(id) });
    },
    ...options,
  });
}
