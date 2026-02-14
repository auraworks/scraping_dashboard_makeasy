import React from "react";
import { SourceForm } from "@/components/sources/SourceForm";

export default function NewSourcePage() {
  return (
    <div className="p-8 w-full ">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">새 정보원 등록</h1>
        <p className="text-gray-500 text-lg">
          수집할 대상을 새롭게 등록합니다. 기초 정보와 데이터 스키마를 설정해주세요.
        </p>
      </div>
      <SourceForm />
    </div>
  );
}
