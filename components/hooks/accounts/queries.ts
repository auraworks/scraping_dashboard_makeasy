import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { accountKeys, AccountFilters } from "./keys";
import { getAccountList, getAccountById, AdminUser, PaginatedUsers } from "./apis";

export function useAccountList(
  filters?: AccountFilters,
  options?: Omit<
    UseQueryOptions<PaginatedUsers, Error, PaginatedUsers, ReturnType<typeof accountKeys.list>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: accountKeys.list(filters),
    queryFn: () => getAccountList(filters),
    ...options,
  });
}

export function useAccountDetail(
  id: string,
  options?: Omit<
    UseQueryOptions<AdminUser, Error, AdminUser, ReturnType<typeof accountKeys.detail>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: accountKeys.detail(id),
    queryFn: () => getAccountById(id),
    enabled: !!id,
    ...options,
  });
}
