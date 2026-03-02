"use client";

import React, { useEffect, useState } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import { useModal } from "@/components/hooks/useModal";
import { useToast } from "@/components/hooks/useToast";
import { ModalContainer } from "@/components/ui/Modal";

export default function CategoriesPage() {
    const router = useRouter();
    const modal = useModal();
    const toast = useToast();
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("name", { ascending: true });

        if (error) {
            console.error("Error fetching categories:", error);
        } else {
            setCategories(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
        e.stopPropagation();

        modal.open({
            title: "유형 삭제",
            description: `'${name}' 유형을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`,
            confirmText: "삭제",
            cancelText: "취소",
            onConfirm: async () => {
                const { error } = await supabase
                    .from("categories")
                    .delete()
                    .eq("id", id);

                if (error) {
                    toast.error("오류", error.message || "삭제 중 오류가 발생했습니다.");
                } else {
                    toast.success("성공", "삭제되었습니다.");
                    fetchCategories();
                }
            },
        });
    };

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 w-full">
            {/* 헤더 섹션 */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2 font-display">유형 관리</h1>
                    <p className="text-gray-500 text-lg">
                        데이터 수집 대상의 유형(Enum)을 실시간으로 관리합니다.
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-11 bg-white border-gray-200 rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500 transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse table-fixed min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50/30 border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 alphabet-uppercase tracking-wider w-[10%]">
                                    NO.
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 alphabet-uppercase tracking-wider w-[80%]">
                                    유형명
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 alphabet-uppercase tracking-wider w-[10%]">
                                    관리
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-10 text-center text-gray-400">
                                        로딩 중...
                                    </td>
                                </tr>
                            ) : filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-10 text-center text-gray-400">
                                        데이터가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((category, index) => (
                                    <tr
                                        key={category.id}
                                        onClick={() => router.push(`/categories/${category.id}`)}
                                        className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-5 whitespace-nowrap text-sm font-mono text-gray-500 font-bold">
                                            #{index + 1}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                                {category.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-center">
                                            <button
                                                onClick={(e) => handleDelete(e, category.id, category.name)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                                                title="삭제"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
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
            <ModalContainer />
        </div>
    );
}
