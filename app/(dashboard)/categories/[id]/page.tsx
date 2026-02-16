import React from "react";
import { CategoryForm } from "@/components/categories/CategoryForm";

// Mock fetching function
async function getCategoryData(id: string) {
    // Demo mock data
    const categories = [
        { id: 1, name: "뉴스", description: "주요 언론사 뉴스 기사" },
        { id: 2, name: "커뮤니티", description: "주요 커뮤니티 게시글" },
        { id: 3, name: "SNS", description: "소셜 미디어 피드" },
        { id: 4, name: "블로그", description: "개인 및 기업 블로그 포스트" },
        { id: 5, name: "카페", description: "네이버/다음 카페 게시글" },
        { id: 6, name: "기타", description: "기타 수집 데이터" },
    ];

    return categories.find((c) => c.id.toString() === id);
}

export async function generateStaticParams() {
    return [
        { id: "1" },
        { id: "2" },
        { id: "3" },
        { id: "4" },
        { id: "5" },
        { id: "6" }
    ];
}

interface EditCategoryPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    const { id } = await params;
    const initialData = await getCategoryData(id);

    if (!initialData) {
        return <div>존재하지 않는 카테고리입니다.</div>;
    }

    return (
        <div className="p-8 w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">유형 정보 수정</h1>
                <p className="text-gray-500 text-lg">
                    유형 ID: <span className="text-primary-600 font-mono font-bold">#{id}</span>의 정보를 수정합니다.
                </p>
            </div>
            <CategoryForm initialData={initialData} isEdit={true} />
        </div>
    );
}
