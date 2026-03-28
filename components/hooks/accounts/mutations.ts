import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { accountKeys } from "./keys";
import {
  createAccount,
  updateAccount,
  deleteAccount,
  AdminUser,
  CreateAccountInput,
  UpdateAccountInput,
} from "./apis";

export function useCreateAccount(
  options?: UseMutationOptions<AdminUser, Error, CreateAccountInput>
) {
  const queryClient = useQueryClient();

  return useMutation<AdminUser, Error, CreateAccountInput>({
    mutationFn: createAccount,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      options?.onError?.(error, variables, onMutateResult, context);
    },
  });
}

export function useUpdateAccount(
  options?: UseMutationOptions<AdminUser, Error, { id: string; updates: UpdateAccountInput }>
) {
  const queryClient = useQueryClient();

  return useMutation<AdminUser, Error, { id: string; updates: UpdateAccountInput }>({
    mutationFn: ({ id, updates }) => updateAccount(id, updates),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(variables.id) });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      options?.onError?.(error, variables, onMutateResult, context);
    },
  });
}

export function useDeleteAccount(
  options?: Omit<UseMutationOptions<void, Error, string>, "mutationFn">
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.removeQueries({ queryKey: accountKeys.detail(id) });
    },
    ...options,
  });
}
