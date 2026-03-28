"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import AccountForm from "@/components/accounts/AccountForm";
import { useAccountDetail } from "@/components/hooks/accounts";

export default function AccountDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: account, isLoading, error } = useAccountDetail(id);

  if (isLoading) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
          <p className="text-gray-500 font-medium">계정 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error || !id || !account) {
    return (
      <div className="flex h-[600px] w-full flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="rounded-full bg-red-50 p-6">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-gray-800">데이터를 불러오지 못했습니다</h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            해당 계정 정보를 찾을 수 없거나,<br />
            서버 연결에 문제가 발생했습니다.
          </p>
          {error && (
            <p className="text-xs text-red-400 mt-2 font-mono">
              Error: {(error as Error).message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">계정 상세 정보</h1>
        <p className="text-gray-500 text-lg">
          <span className="font-bold text-primary-600">{account.email}</span> 계정의 정보를 관리합니다.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 overflow-hidden ring-1 ring-black/5">
        <AccountForm initialData={account} isEdit={true} />
      </div>
    </div>
  );
}
