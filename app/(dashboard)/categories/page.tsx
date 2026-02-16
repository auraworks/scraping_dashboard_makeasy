"use client";

import React from "react";
import { Search, Plus, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CategoriesPage() {
    const router = useRouter();

    // Mock Data
    const categories = [
        { id: 1, name: "뉴스", description: "주요 언론사 뉴스 기사" },
        { id: 2, name: "커뮤니티", description: "주요 커뮤니티 게시글" },
        { id: 3, name: "SNS", description: "소셜 미디어 피드" },
        { id: 4, name: "블로그", description: "개인 및 기업 블로그 포스트" },
        { id: 5, name: "카페", description: "네이버/다음 카페 게시글" },
        { id: 6, name: "기타", description: "기타 수집 데이터" },
    ];

    return (
        <div className="p-8 w-full">
            {/* 헤더 섹션 */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">유형 관리</h1>
                    <p className="text-gray-500 text-lg">
                        데이터 수집 대상의 유형을 등록하고 관리합니다.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => router.push("/categories/new")}
                        className="px-5 py-6 bg-primary-500 text-white rounded-xl text-base font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary-200"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        새 유형 추가
                    </Button>
                </div>
            </div>

            {/* 테이블 컨테이너 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ring-1 ring-black/5">
                {/* 검색 바 */}
                <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-gray-50/50">
                    <div className="relative w-full xl:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                            placeholder="카테고리명 검색"
                            className="pl-10 h-11 bg-white border-gray-200 rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500 transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse table-fixed min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50/30 border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[20%]">
                                    NO.
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[80%]">
                                    유형명
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {categories.map((category) => (
                                <tr
                                    key={category.id}
                                    onClick={() => router.push(`/categories/${category.id}`)}
                                    className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-5 whitespace-nowrap text-sm font-mono text-gray-500 font-bold">
                                        #{category.id}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                            {category.name}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 섹션 */}
                <div className="px-6 py-4 border-t border-gray-100 flex flex-row items-center justify-end gap-4 bg-gray-50/20">
                    <Pagination className="mx-0 w-auto">
                        <PaginationContent className="gap-2">
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    className="rounded-xl border-gray-200 bg-white hover:bg-gray-50 h-10 px-4 transition-all"
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    isActive
                                    className="w-10 h-10 rounded-xl bg-primary-500 text-white border-none font-bold shadow-md shadow-primary-200 hover:bg-primary-600 transition-all"
                                >
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    className="rounded-xl border-gray-200 bg-white hover:bg-gray-50 h-10 px-4 transition-all"
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}
