import { createClient } from "@/lib/supabase/client";
import type { ApiError } from "@/types/database";

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  parent_id?: string | null;
  sort_order?: number | null;
}

// Get categories filtered by parent_id.
// - parentId === null  → 유형1 (top-level, parent_id IS NULL)
// - parentId === string → 유형2 (children of that parent)
// - parentId === undefined → all categories (backwards-compatible)
export async function getCategories(parentId?: string | null): Promise<Category[]> {
  const supabase = createClient();

  let query = supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (parentId === null) {
    query = query.is("parent_id", null);
  } else if (typeof parentId === "string") {
    query = query.eq("parent_id", parentId);
  }
  // parentId === undefined → no filter, return all (backwards-compatible)

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

// Add a new category. parentId = null → 유형1, parentId = string → 유형2
export async function insertCategory(
  name: string,
  parentId?: string | null
): Promise<Category> {
  const supabase = createClient();

  const payload: { name: string; parent_id?: string | null } = { name };
  if (parentId !== undefined) payload.parent_id = parentId;

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
