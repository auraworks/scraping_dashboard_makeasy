"use client";

import React, { useState, useRef } from "react";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/components/hooks/categories/queries";
import { useAddCategory, useDeleteCategory } from "@/components/hooks/categories/mutations";
import { useToast } from "@/components/hooks/useToast";
import type { Category } from "@/components/hooks/categories/apis";

// ── Inline Add Form ────────────────────────────────────────────────────────

function AddCategoryForm({
  onAdd,
  isPending,
  placeholder,
}: {
  onAdd: (name: string) => Promise<void>;
  isPending: boolean;
  placeholder: string;
}) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    await onAdd(trimmed);
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={isPending}
        className="h-10 rounded-xl border-gray-200 bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-500 text-sm"
      />
      <Button
        type="submit"
        disabled={isPending || !value.trim()}
        className="h-10 px-4 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 shadow-sm shrink-0"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
}

// ── Category Row ───────────────────────────────────────────────────────────

function CategoryRow({
  category,
  onDelete,
  isDeleting,
}: {
  category: Category;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    onDelete();
  };

  return (
    <div className="group flex items-center justify-between px-4 py-3 rounded-xl transition-all hover:bg-gray-50">
      <div className="flex items-center gap-2 min-w-0">
        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300" />
        <span className="text-sm font-medium truncate text-gray-700">
          {category.name}
        </span>
      </div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        title={confirmDelete ? "한 번 더 클릭하면 삭제됩니다" : "삭제"}
        className={`p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
          confirmDelete
            ? "bg-red-500 text-white opacity-100"
            : "text-gray-300 hover:text-red-500 hover:bg-red-50"
        }`}
      >
        {isDeleting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Trash2 className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

// ── Category Card ──────────────────────────────────────────────────────────

function CategoryCard({
  title,
  subtitle,
  categories,
  isLoading,
  onAdd,
  onDelete,
  deletingId,
  addPending,
  addPlaceholder,
  emptyMessage,
}: {
  title: string;
  subtitle?: string;
  categories: Category[];
  isLoading: boolean;
  onAdd: (name: string) => Promise<void>;
  onDelete: (id: string) => void;
  deletingId: string | null;
  addPending: boolean;
  addPlaceholder: string;
  emptyMessage: string;
}) {
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 ring-1 ring-black/5 overflow-hidden flex-1 min-w-0">
      {/* 카드 헤더 */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
      </div>

      {/* 목록 */}
      <div className="flex-1 overflow-y-auto px-3 py-3 min-h-[200px] max-h-[500px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
            {emptyMessage}
          </div>
        ) : (
          <div className="space-y-0.5">
            {categories.map((cat) => (
              <CategoryRow
                key={cat.id}
                category={cat}
                onDelete={() => onDelete(cat.id)}
                isDeleting={deletingId === cat.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* 추가 폼 */}
      <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/30">
        <AddCategoryForm
          onAdd={onAdd}
          isPending={addPending}
          placeholder={addPlaceholder}
        />
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function CategoriesPage() {
  const toast = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: cat1List = [], isLoading: loadingCat1 } = useCategories(1);
  const { data: cat2List = [], isLoading: loadingCat2 } = useCategories(2);

  const addMutation = useAddCategory();
  const deleteMutation = useDeleteCategory();

  const handleAddCat1 = async (name: string) => {
    try {
      await addMutation.mutateAsync({ name, type: 1 });
      toast.success("유형1 추가", `"${name}"이(가) 추가되었습니다.`);
    } catch (err) {
      toast.error("추가 실패", (err as Error).message);
    }
  };

  const handleAddCat2 = async (name: string) => {
    try {
      await addMutation.mutateAsync({ name, type: 2 });
      toast.success("유형2 추가", `"${name}"이(가) 추가되었습니다.`);
    } catch (err) {
      toast.error("추가 실패", (err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("삭제 완료", "항목이 삭제되었습니다.");
    } catch (err) {
      toast.error("삭제 실패", (err as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">유형 관리</h1>
        <p className="text-gray-500 text-lg">
          데이터 수집 대상의 카테고리 및 유형을 관리합니다.
        </p>
      </div>

      <div className="flex gap-6 items-stretch">
        <CategoryCard
          title="유형1"
          subtitle="독립 유형"
          categories={cat1List}
          isLoading={loadingCat1}
          onAdd={handleAddCat1}
          onDelete={handleDelete}
          deletingId={deletingId}
          addPending={addMutation.isPending}
          addPlaceholder="새 유형1 이름 입력"
          emptyMessage="등록된 유형1이 없습니다."
        />

        <CategoryCard
          title="유형2"
          subtitle="독립 유형"
          categories={cat2List}
          isLoading={loadingCat2}
          onAdd={handleAddCat2}
          onDelete={handleDelete}
          deletingId={deletingId}
          addPending={addMutation.isPending}
          addPlaceholder="새 유형2 이름 입력"
          emptyMessage="등록된 유형2가 없습니다."
        />
      </div>
    </div>
  );
}
