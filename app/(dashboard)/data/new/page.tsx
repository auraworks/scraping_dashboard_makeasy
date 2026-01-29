import React from "react";
import { DataForm } from "@/components/data/DataForm";

export default function NewDataPage() {
  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">새 데이터 등록</h1>
        <p className="text-gray-500 text-lg">
          수집된 원본 데이터를 수동으로 등록하거나 새로운 데이터 셋을 생성합니다.
        </p>
      </div>
      <DataForm />
    </div>
  );
}
