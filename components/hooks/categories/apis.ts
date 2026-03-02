import { createClient } from "@/lib/supabase/client";
import type { ApiError } from "@/types/database";
export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

// Get all categories from 'categories' table
export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw {
      message: error.message,
      code: error.code,
      details: error.details,
    } as ApiError;
  }

  return data || [];
}

// Add a new category to 'categories' table
export async function insertCategory(name: string): Promise<Category> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .insert([{ name }])
    .select()
    .single();

  if (error) {
    throw {
      message: error.message || "카테고리 추가 중 오류가 발생했습니다.",
      code: error.code,
      details: error.details,
    } as ApiError;
  }

  return data;
}

// Update a category name in 'categories' table
export async function updateCategory(
  id: string,
  newName: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("categories")
    .update({ name: newName })
    .eq("id", id);

  if (error) {
    throw {
      message: error.message || "카테고리 수정 중 오류가 발생했습니다.",
      code: error.code,
      details: error.details,
    } as ApiError;
  }
}

// Delete a category from 'categories' table
export async function deleteCategory(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    throw {
      message: error.message || "카테고리 삭제 중 오류가 발생했습니다.",
      code: error.code,
      details: error.details,
    } as ApiError;
  }
}
