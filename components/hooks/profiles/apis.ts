// Profile API Functions
import { createClient } from "@/lib/supabase/client";
import type { Profile, PaginatedResponse, ApiError } from "@/types/database";
import type { ProfileFilters } from "./keys";

// Get current user profile
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
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

// Get all profiles with pagination and filters
export async function getProfiles(
  filters?: ProfileFilters
): Promise<PaginatedResponse<Profile>> {
  const supabase = createClient();

  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" });

  // Apply filters
  if (filters?.role && filters.role !== "all") {
    query = query.eq("role", filters.role);
  }
  if (filters?.search) {
    query = query.or(`email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`);
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

// Get single profile by ID
export async function getProfileById(id: string): Promise<Profile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
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

// Update profile
export async function updateProfile(
  id: string,
  updates: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>
): Promise<Profile> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
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

// Delete profile
export async function deleteProfile(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("profiles").delete().eq("id", id);

  if (error) {
    throw {
      message: error.message,
      code: error.code,
      details: error.details,
    } as ApiError;
  }
}
