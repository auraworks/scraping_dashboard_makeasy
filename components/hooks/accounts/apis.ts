import type { AccountFilters } from "./keys";

export interface AdminUser {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
  last_sign_in_at?: string | null;
  created_at: string;
  banned_until?: string | null;
  user_metadata: { name?: string; [key: string]: unknown };
}

export interface PaginatedUsers {
  data: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateAccountInput {
  email: string;
  password: string;
  name?: string;
}

export interface UpdateAccountInput {
  password?: string;
  name?: string;
  banned?: boolean;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "요청 처리 중 오류가 발생했습니다.");
  return json as T;
}

export async function getAccountList(filters?: AccountFilters): Promise<PaginatedUsers> {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.pageSize) params.set("pageSize", String(filters.pageSize));

  const res = await fetch(`/api/admin/users?${params.toString()}`);
  return handleResponse<PaginatedUsers>(res);
}

export async function getAccountById(id: string): Promise<AdminUser> {
  const res = await fetch(`/api/admin/users/${id}`);
  const json = await handleResponse<{ data: AdminUser }>(res);
  return json.data;
}

export async function createAccount(input: CreateAccountInput): Promise<AdminUser> {
  const res = await fetch("/api/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await handleResponse<{ data: AdminUser }>(res);
  return json.data;
}

export async function updateAccount(
  id: string,
  input: UpdateAccountInput
): Promise<AdminUser> {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await handleResponse<{ data: AdminUser }>(res);
  return json.data;
}

export async function deleteAccount(id: string): Promise<void> {
  const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
  await handleResponse<{ success: boolean }>(res);
}
