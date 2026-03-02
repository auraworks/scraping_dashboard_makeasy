// Data API Functions
import { createClient } from "@/lib/supabase/client";
import type { Data, PaginatedResponse, ApiError } from "@/types/database";
import type { DataFilters } from "./keys";

// Get all data with pagination and filters
export async function getData(
  filters?: DataFilters
): Promise<PaginatedResponse<Data>> {
  const supabase = createClient();

  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("datas")
    .select("*", { count: "exact" });

  // Apply filters
  if (filters?.country && filters.country !== "all") {
    query = query.eq("country", filters.country);
  }
  if (filters?.type && filters.type !== "all") {
    query = query.eq("type", filters.type);
  }
  if (filters?.sourceId) {
    query = query.eq("source_id", filters.sourceId);
  }
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
  }
  if (filters?.publishedAt) {
    query = query.gte("published_at", filters.publishedAt);
  }

  const { data, error, count } = await query
    .order("collected_at", { ascending: false })
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

// Get single data by ID
export async function getDataById(id: string): Promise<Data | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("datas")
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

// Create new data
export async function createData(
  inputData: Omit<Data, "id" | "created_at">
): Promise<Data> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("datas")
    .insert(inputData)
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

// Update data
export async function updateData(
  id: string,
  updates: Partial<Omit<Data, "id" | "created_at">>
): Promise<Data> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("datas")
    .update(updates)
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

// Delete data
export async function deleteData(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("datas").delete().eq("id", id);

  if (error) {
    throw {
      message: error.message,
      code: error.code,
      details: error.details,
    } as ApiError;
  }
}

// Get data by source ID
export async function getDataBySource(
  sourceId: number,
  page = 1,
  pageSize = 10
): Promise<PaginatedResponse<Data>> {
  const supabase = createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("datas")
    .select("*", { count: "exact" })
    .eq("source_id", sourceId)
    .order("collected_at", { ascending: false })
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
