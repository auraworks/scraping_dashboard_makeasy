// Profile Mutation Hooks
import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { updateProfile, deleteProfile } from "./apis";
import { profileKeys } from "./keys";
import type { Profile, ApiError } from "@/types/database";

// Update Profile Mutation
export function useUpdateProfile(
  options?: Omit<
    UseMutationOptions<
      Profile,
      ApiError,
      { id: string; updates: Partial<Omit<Profile, "id" | "created_at" | "updated_at">> }
    >,
    "mutationFn" | "onSuccess"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => updateProfile(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.lists() });
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: profileKeys.current() });
    },
    ...options,
  });
}

// Delete Profile Mutation
export function useDeleteProfile(
  options?: Omit<
    UseMutationOptions<void, ApiError, string>,
    "mutationFn" | "onSuccess"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfile,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.lists() });
      queryClient.removeQueries({ queryKey: profileKeys.detail(id) });
    },
    ...options,
  });
}
