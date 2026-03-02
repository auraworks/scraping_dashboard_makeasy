// Source API Functions
import { createClient } from "@/lib/supabase/client";
import type { Source, PaginatedResponse, ApiError } from "@/types/database";
import type { SourceFilters } from "./keys";

// Get all sources with pagination and filters
export async function getSources(
  filters?: SourceFilters
): Promise<PaginatedResponse<Source>> {
  const supabase = createClient();

  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("sources")
    .select("*", { count: "exact" });

  // Apply filters
  if (filters?.country && filters.country !== "all") {
    query = query.eq("country", filters.country);
  }
  if (filters?.type && filters.type !== "all") {
    query = query.eq("type", filters.type);
  }
  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,url.ilike.%${filters.search}%`);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

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

// Get single source by ID
export async function getSourceById(id: number): Promise<Source | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("sources")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw {
      message: error.message,
      code: error.code,
      details: error.details,
    } as ApiError;
  }

  return data;
}

// Create new source
export async function createSource(
  inputSource: Omit<Source, "id" | "created_at" | "updated_at">
): Promise<Source> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("sources")
    .insert(inputSource)
    .select()
    .single();

  if (error) {
    throw {
      message: error.message,
      code: error.code,
      details: error.details,
    } as ApiError;
  }

  return data;
}

// Update source
export async function updateSource(
  id: number,
  updates: Partial<Omit<Source, "id" | "created_at" | "updated_at">>
): Promise<Source> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("sources")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw {
      message: error.message,
      code: error.code,
      details: error.details,
    } as ApiError;
  }

  return data;
}

// Delete source
export async function deleteSource(id: number): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("sources").delete().eq("id", id);

  if (error) {
    throw {
      message: error.message,
      code: error.code,
      details: error.details,
    } as ApiError;
  }
}

// Update source status
export async function updateSourceStatus(
  id: number,
  status: Source["status"]
): Promise<Source> {
  return updateSource(id, { status });
}

// Update last collected timestamp
export async function updateLastCollected(
  id: number,
  timestamp: string
): Promise<Source> {
  return updateSource(id, { last_collected: timestamp });
}
