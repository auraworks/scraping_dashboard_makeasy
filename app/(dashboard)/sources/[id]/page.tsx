"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SourceForm } from "@/components/sources/SourceForm";
import { useSourceDetail } from "@/components/hooks/sources/queries";
import { useSoftDeleteSource } from "@/components/hooks/sources/mutations";
import { useToast } from "@/components/hooks/useToast";
import { Loader2, AlertCircle } from "lucide-react";

export default function SourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const idStr = params?.id as string;
  const id = idStr ? parseInt(idStr, 10) : null;
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: source, isLoading, error } = useSourceDetail(id as number);
  const softDeleteMutation = useSoftDeleteSource();

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    if (!id) return;
    try {
      await softDeleteMutation.mutateAsync(id);
      toast.success("삭제 완료", "정보원이 삭제되었습니다.");
      router.push("/sources");
    } catch (err) {
      toast.error("삭제 실패", (err as Error).message);
    }
  };

  // Mapping DB data to Form values
  const initialData = source ?? undefined;

  if (isLoading) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
          <p className="text-gray-500 font-medium">정보원 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error || !id || isNaN(id) || !source) {
    return (
      <div className="flex h-[600px] w-full flex-col items-center justify-center gap-6 p-8 text-center text-gray-800">
        <div className="rounded-full bg-red-50 p-6">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight">데이터를 불러오지 못했습니다</h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            해당 정보원 정보를 찾을 수 없거나,<br />
            데이터베이스 연결에 문제가 발생했습니다.
          </p>
          {error && <p className="text-xs text-red-400 mt-2 font-mono">Error: {error.message}</p>}
        </div>

      </div>
    );
  }

  return (
    <div className="p-8 w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">정보원 상세 정보</h1>
          <p className="text-gray-500 text-lg">
            등록된 정보원(<span className="font-bold text-primary-600">ID #{source.id}</span>)의 수집 설정 및 상세 규칙을 관리합니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 overflow-hidden ring-1 ring-black/5">
        <SourceForm
          initialData={initialData}
          isEdit={true}
          onDelete={handleDelete}
          isDeleting={softDeleteMutation.isPending}
        />
      </div>
    </div>
  );
}
