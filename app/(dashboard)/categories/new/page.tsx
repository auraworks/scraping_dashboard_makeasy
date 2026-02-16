"use client";

import React from "react";
import { CategoryForm } from "@/components/categories/CategoryForm";

export default function NewCategoryPage() {
    return (
        <div className="p-8 w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">새 유형 등록</h1>
                <p className="text-gray-500 text-lg">
                    새로운 데이터 수집 유형을 등록합니다.
                </p>
            </div>
            <CategoryForm />
        </div>
    );
}
