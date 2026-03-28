"use client";

import React, { useState } from "react";
import { Search, Plus, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useAccountList } from "@/components/hooks/accounts";

export default function AccountsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useAccountList({
    search: searchTerm || undefined,
    page,
    pageSize: 10,
  });

  const accounts = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\. /g, "/").replace(/\.$/, "");
  };

  const isBanned = (bannedUntil?: string | null) => {
    if (!bannedUntil) return false;
    return new Date(bannedUntil) > new Date();
  };

  return (
    <div className="p-8 w-full">
      {/* 헤더 */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">계정 관리</h1>
          <p className="text-gray-500 text-lg">시스템에 접근할 수 있는 계정을 등록하고 관리합니다.</p>
        </div>
        <Button
          onClick={() => router.push("/accounts/new")}
          className="px-5 py-6 bg-primary-500 text-white rounded-xl text-base font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary-200"
        >
          <Plus className="w-5 h-5 mr-2" />새 계정 추가
        </Button>
      </div>

      {/* 테이블 컨테이너 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ring-1 ring-black/5">
        {/* 검색 바 */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="relative w-full xl:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                placeholder="이메일 또는 이름 검색"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-11 bg-white border-gray-200 rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500 transition-all shadow-sm"
              />
            </div>
            {searchTerm && (
              <Button
                variant="ghost"
                onClick={() => handleSearch("")}
                className="h-11 px-2 text-gray-400 hover:text-primary-600 font-bold"
              >
                초기화
              </Button>
            )}
          </div>
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[30%]">
                  이메일
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[15%]">
                  이름
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[12%]">
                  이메일 확인
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[12%]">
                  상태
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[15%]">
                  마지막 로그인
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[16%]">
                  생성일
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                      <span className="text-gray-400 font-medium">로딩 중...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <span className="text-red-500 font-medium">
                      데이터를 불러오는 중 오류가 발생했습니다.
                    </span>
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <span className="text-gray-400 font-medium">등록된 계정이 없습니다.</span>
                  </td>
                </tr>
              ) : (
                accounts.map((account) => {
                  const banned = isBanned(account.banned_until);
                  return (
                    <tr
                      key={account.id}
                      onClick={() => router.push(`/accounts/${account.id}`)}
                      className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900 truncate">
                          {account.email ?? "-"}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-gray-600 truncate">
                          {account.user_metadata?.name ?? "-"}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        {account.email_confirmed_at ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-300" />
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        {banned ? (
                          <Badge className="bg-red-50 text-red-500 border-red-100 hover:bg-red-50 font-bold px-2.5 py-0.5 rounded-lg text-[11px]">
                            비활성
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50 font-bold px-2.5 py-0.5 rounded-lg text-[11px]">
                            활성
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(account.last_sign_in_at)}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(account.created_at)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-row items-center justify-between gap-4 bg-gray-50/20">
          <div className="text-sm text-gray-500">
            총 <span className="font-bold text-gray-700">{total}</span>개의 계정
          </div>
          <Pagination className="mx-0 w-auto">
            <PaginationContent className="gap-2">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage(page - 1)}
                  className={`rounded-xl border-gray-200 bg-white hover:bg-gray-50 h-10 px-4 transition-all cursor-pointer ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setPage(pageNum)}
                      isActive={page === pageNum}
                      className={`w-10 h-10 rounded-xl font-bold transition-all cursor-pointer ${
                        page === pageNum
                          ? "bg-primary-500 text-white border-none shadow-md shadow-primary-200 hover:bg-primary-600"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              {totalPages > 5 && page < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && setPage(page + 1)}
                  className={`rounded-xl border-gray-200 bg-white hover:bg-gray-50 h-10 px-4 transition-all cursor-pointer ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
