// Profile Query Hooks
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { profileKeys, ProfileFilters } from "./keys";
import { getProfiles, getProfileById, getCurrentProfile } from "./apis";
import type { Profile, PaginatedResponse, ApiError } from "@/types/database";

// Use Current Profile
export function useCurrentProfile(
  options?: Omit<
    UseQueryOptions<Profile | null, ApiError, Profile | null, ReturnType<typeof profileKeys.current>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: getCurrentProfile,
    ...options,
  });
}

// Use Profiles List with filters
export function useProfiles(
  filters?: ProfileFilters,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Profile>, ApiError, PaginatedResponse<Profile>, ReturnType<typeof profileKeys.list>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: profileKeys.list(filters),
    queryFn: () => getProfiles(filters),
    ...options,
  });
}

// Use Profile Detail
export function useProfileDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<Profile | null, ApiError, Profile | null, ReturnType<typeof profileKeys.detail>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: profileKeys.detail(id),
    queryFn: () => getProfileById(id),
    enabled: !!id,
    ...options,
  });
}
