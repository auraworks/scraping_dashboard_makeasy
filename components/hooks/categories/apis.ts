import { createClient } from "@/lib/supabase/client";
import type { ApiError } from "@/types/database";

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  category_type?: number;
  sort_order?: number | null;
}

// Get categories filtered by category_type.
// - type === 1 → 유형1
// - type === 2 → 유형2
// - type === undefined → all categories
export async function getCategories(type?: 1 | 2): Promise<Category[]> {
  const supabase = createClient();

  let query = supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (type !== undefined) {
    query = query.eq("category_type", type);
  }

  const { data, error } = await query;

  if (error) {
    throw {
      message: error.message,
      code: error.code,
      details: error.details,
    } as ApiError;
  }

  return data || [];
}

// Add a new category. type = 1 → 유형1, type = 2 → 유형2
export async function insertCategory(
  name: string,
  type: 1 | 2 = 1
): Promise<Category> {
  const supabase = createClient();

  const payload: { name: string; category_type: number } = { name, category_type: type };

  const { data, error } = await supabase
    .from("categories")
    .insert([payload])
    .select()
    .single();

  if (error) {
    const isDuplicate = error.code === "23505";
    throw {
      message: isDuplicate
        ? "이미 존재하는 유형명입니다. 다른 이름을 사용해주세요."
        : error.message || "카테고리 추가 중 오류가 발생했습니다.",
      code: error.code,
      details: error.details,
    } as ApiError;
  }

  return data;
}

// Update a category name
export async function updateCategory(id: string, newName: string): Promise<void> {
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

// Delete a category (CASCADE removes children automatically)
export async function deleteCategory(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    throw {
      message: error.message || "카테고리 삭제 중 오류가 발생했습니다.",
      code: error.code,
      details: error.details,
    } as ApiError;
  }
}
