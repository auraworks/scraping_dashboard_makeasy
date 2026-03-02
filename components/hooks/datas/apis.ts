// Data API Functions
import { createClient } from "@/lib/supabase/client";
import type { Data, DataWithSource, PaginatedResponse, ApiError, Country } from "@/types/database";
import type { DataFilters } from "./keys";

// Get all data with pagination and filters (includes source info via JOIN)
export async function getData(
  filters?: DataFilters
): Promise<PaginatedResponse<DataWithSource>> {
  const supabase = createClient();

  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // If category filter is set, first get source IDs with that category
  let sourceIds: number[] | null = null;
  if (filters?.category && filters.category !== "all") {
    const { data: sourcesData, error: sourcesError } = await supabase
      .from("sources")
      .select("id")
      .eq("category", filters.category);

    if (sourcesError) {
      throw {
        message: sourcesError.message,
        code: sourcesError.code,
        details: sourcesError.details,
      } as ApiError;
    }

    sourceIds = sourcesData?.map((s) => s.id) || [];

    // If no sources found with this category, return empty result
    if (sourceIds.length === 0) {
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }
  }

  // JOIN with sources to get country, name, and category
  let query = supabase
    .from("datas")
    .select(`
      *,
      sources (
        id,
        country,
        name,
        category
      )
    `, { count: "exact" });

  // Apply filters
  if (filters?.sourceId) {
    query = query.eq("source_id", filters.sourceId);
  }
  if (sourceIds) {
    query = query.in("source_id", sourceIds);
  }
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
  }
  if (filters?.publishedAt) {
    query = query.gte("published_date", filters.publishedAt);
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

  // Filter by country after fetch (since it's in the joined table)
  let filteredData = data as DataWithSource[];
  if (filters?.country && filters.country !== "all") {
    filteredData = filteredData.filter(
      (item) => item.sources?.country === filters.country
    );
  }

  return {
    data: filteredData || [],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

// Get single data by ID with source info
export async function getDataById(id: number): Promise<DataWithSource | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("datas")
    .select(`
      *,
      sources (
        id,
        country,
        name,
        category
      )
    `)
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

  return data as DataWithSource;
}

// Get data by data_id (UUID)
export async function getDataByDataId(dataId: string): Promise<DataWithSource | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("datas")
    .select(`
      *,
      sources (
        id,
        country,
        name,
        category
      )
    `)
    .eq("data_id", dataId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw {
      message: error.message,
      code: error.code,
      details: error.details,
    } as ApiError;
  }

  return data as DataWithSource;
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
  id: number,
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
export async function deleteData(id: number): Promise<void> {
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

// Get data by source ID with source info
export async function getDataBySource(
  sourceId: number,
  page = 1,
  pageSize = 10
): Promise<PaginatedResponse<DataWithSource>> {
  const supabase = createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("datas")
    .select(`
      *,
      sources (
        id,
        country,
        name,
        category
      )
    `, { count: "exact" })
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
    data: (data || []) as DataWithSource[],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

// Get unique countries from sources (for filter dropdown)
export async function getCountries(): Promise<Country[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("sources")
    .select("country")
    .not("country", "is", null);

  if (error) {
    throw {
      message: error.message,
      code: error.code,
      details: error.details,
    } as ApiError;
  }

  // Get unique countries
  const uniqueCountries = [...new Set(data.map((s) => s.country).filter(Boolean))] as Country[];
  return uniqueCountries.sort((a, b) => {
    if (a === "대한민국") return -1;
    if (b === "대한민국") return 1;
    return a.localeCompare(b, 'ko');
  });
}

// Get unique categories from sources (for filter dropdown)
export async function getSourceCategories(): Promise<string[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("sources")
    .select("category")
    .not("category", "is", null);

  if (error) {
    throw {
      message: error.message,
      code: error.code,
      details: error.details,
    } as ApiError;
  }

  // Get unique categories
  const uniqueCategories = [...new Set(data.map((s) => s.category).filter(Boolean))] as string[];
  return uniqueCategories.sort((a, b) => a.localeCompare(b, 'ko'));
}
