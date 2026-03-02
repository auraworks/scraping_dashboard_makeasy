// Source Mutation Hooks
import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import {
  createSource,
  updateSource,
  deleteSource,
  updateSourceStatus,
  updateLastCollected,
} from "./apis";
import { sourceKeys } from "./keys";
import type { Source, ApiError } from "@/types/database";

// Create Source Mutation
export function useCreateSource(
  options?: Omit<
    UseMutationOptions<Source, ApiError, Omit<Source, "id" | "created_at" | "updated_at">>,
    "mutationFn" | "onSuccess"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sourceKeys.lists() });
    },
    ...options,
  });
}

// Update Source Mutation
export function useUpdateSource(
  options?: Omit<
    UseMutationOptions<
      Source,
      ApiError,
      { id: number; updates: Partial<Omit<Source, "id" | "created_at" | "updated_at">> }
    >,
    "mutationFn" | "onSuccess"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => updateSource(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: sourceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sourceKeys.detail(data.id) });
    },
    ...options,
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

// Update Source Status Mutation
export function useUpdateSourceStatus(
  options?: Omit<
    UseMutationOptions<Source, ApiError, { id: number; status: Source["status"] }>,
    "mutationFn" | "onSuccess"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateSourceStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: sourceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sourceKeys.detail(data.id) });
    },
    ...options,
  });
}

// Update Last Collected Mutation
export function useUpdateLastCollected(
  options?: Omit<
    UseMutationOptions<Source, ApiError, { id: number; timestamp: string }>,
    "mutationFn" | "onSuccess"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, timestamp }) => updateLastCollected(id, timestamp),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: sourceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sourceKeys.detail(data.id) });
    },
    ...options,
  });
}
