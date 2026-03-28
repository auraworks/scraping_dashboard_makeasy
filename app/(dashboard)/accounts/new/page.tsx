"use client";

import React from "react";
import AccountForm from "@/components/accounts/AccountForm";

export default function NewAccountPage() {
  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">새 계정 추가</h1>
        <p className="text-gray-500 text-lg">시스템에 로그인할 수 있는 새 계정을 생성합니다.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 overflow-hidden ring-1 ring-black/5">
        <AccountForm />
      </div>
    </div>
  );
}
