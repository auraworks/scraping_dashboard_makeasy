"use client";

import React from "react";
import { Search, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useLogList } from "@/components/hooks";

export default function LogsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [failOnly, setFailOnly] = React.useState(false);

  const {
    data: logsData,
    isLoading,
    error,
  } = useLogList({
    search: searchTerm || undefined,
    page,
    pageSize: 10,
    failOnly: failOnly || undefined,
  });

  const logs = logsData?.data || [];
  const totalPages = logsData?.totalPages || 1;

  const formatDate = (dateString: string) => {
    // DB에 KST 시간이 UTC로 잘못 저장되어 있는 경우를 대비하여 9시간을 뺍니다.
    // (예: 실제 17시인 시간이 DB에는 17시 UTC로 저장되어 UI에서 02시(다음날)로 보이는 현상 방지)
    const date = new Date(new Date(dateString).getTime() - 9 * 60 * 60 * 1000);

    return date.toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).replace(/\. /g, "/").replace(/\./, "");
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleFailOnlyChange = (checked: boolean) => {
    setFailOnly(checked);
    setPage(1);
  };

  return (
    <div className="p-8 w-full">
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
          로그 관리
        </h1>
        <p className="text-gray-500 text-lg">
          시스템 수집 실시간 로그를 모니터링합니다.
        </p>
      </div>

      {/* 테이블 컨테이너 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ring-1 ring-black/5">
        {/* 검색 바 */}
        <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              placeholder="정보원명 또는 URL 검색"
              value={searchTerm}
              onChange={(event) => handleSearch(event.target.value)}
              className="pl-10 h-11 bg-white border-gray-200 rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="failOnly"
              checked={failOnly}
              onCheckedChange={(checked) => handleFailOnlyChange(checked === true)}
              className="border-gray-300 data-[state=checked]:bg-primary-900 data-[state=checked]:border-primary-900"
            />
            <Label
              htmlFor="failOnly"
              className="text-sm font-medium text-gray-600 cursor-pointer select-none"
            >
              실패 항목만 보기
            </Label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed min-w-[1200px]">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[15%]">
                  정보원명
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[25%]">
                  URL
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[15%]">
                  수집시간
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[15%]">
                  수집결과
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[30%]">
                  로그
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                      <span className="text-gray-400 font-medium">
                        로딩 중...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <span className="text-red-500 font-medium">
                      데이터를 불러오는 중 오류가 발생했습니다.
                    </span>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <span className="text-gray-400 font-medium">
                      등록된 로그가 없습니다.
                    </span>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const level = log.level?.toLowerCase() || "";
                  const isSuccess = level !== "error" && level !== "failure";
                  const sourceName =
                    log.sources?.name || `#${log.source_id ?? "-"}`;
                  const errorMessage = log.message || "-";

                  return (
                    <tr
                      key={log.id}
                      onClick={() => router.push(`/logs/${log.id}`)}
                      className="group hover:bg-gray-50/80 transition-all cursor-pointer"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {sourceName}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-xs text-gray-400 font-medium truncate font-mono">
                          {log.url || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-medium font-mono">
                          {formatDate(log.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`font-bold px-2.5 py-1 rounded-lg shadow-none border flex items-center gap-1.5 ${isSuccess
                              ? "bg-primary-50 text-primary-600 border-primary-100"
                              : "bg-primary-900 text-white border-primary-900"
                              }`}
                          >
                            {isSuccess ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            {isSuccess ? (isSuccess ? "SUCCESS" : "INFO") : "FAIL"}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div
                          className={`text-sm font-medium line-clamp-2 group-hover:line-clamp-none transition-all ${isSuccess ? "text-gray-500" : "text-rose-500"}`}
                        >
                          {errorMessage}
                        </div>
                      </td>
                    </tr>
                  );
                })
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
                  onClick={() => page > 1 && setPage(page - 1)}
                  className={`rounded-xl border-gray-200 bg-white hover:bg-gray-50 h-10 px-4 transition-all cursor-pointer ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
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
                      className={`w-10 h-10 rounded-xl font-bold transition-all cursor-pointer ${page === pageNum
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
