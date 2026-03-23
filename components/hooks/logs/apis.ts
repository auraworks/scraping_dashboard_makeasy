import { createClient } from "@/lib/supabase/client";
import type { Log, PaginatedResponse, ApiError } from "@/types/database";
import type { LogFilters } from "./types";

export async function getLogs(
  filters?: LogFilters,
): Promise<PaginatedResponse<Log>> {
  const supabase = createClient();

  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("logs")
    .select(`*, sources(name)`, { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters?.search) {
    query = query.or(`message.ilike.%${filters.search}%,url.ilike.%${filters.search}%`);
  }

  if (filters?.failOnly) {
    query = query
      .not("level", "ilike", "info")
      .not("level", "ilike", "success");
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw {
      message: error.message,
      code: error.code,
      details: error.details,
    } as ApiError;
  }

  return {
    data: data || [],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getLogById(id: string): Promise<Log | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("logs")
    .select(`*, sources(name)`)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw {
      message: error.message,
      code: error.code,
      details: error.details,
    } as ApiError;
  }

  return data;
}
