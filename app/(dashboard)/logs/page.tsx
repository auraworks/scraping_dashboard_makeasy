"use client";

import React from "react";
import { Search, Filter, MoreHorizontal, CheckCircle2, XCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function LogsPage() {
  const router = useRouter();

  const logs = [
    {
      id: 1,
      sourceName: "네이버 뉴스",
      url: "https://news.naver.com",
      timestamp: "2024/01/26 10:00:01",
      result: "SUCCESS",
      details: "총 15건 데이터 수집 완료",
      errorLog: "-",
    },
    {
      id: 2,
      sourceName: "인스타그램",
      url: "https://instagram.com/explore/tags/trend",
      timestamp: "2024/01/26 10:05:42",
      result: "SUCCESS",
      details: "총 42건 데이터 수집 완료",
      errorLog: "-",
    },
    {
      id: 3,
      sourceName: "다음 뉴스",
      url: "https://news.daum.net",
      timestamp: "2024/01/26 10:10:15",
      result: "FAILURE",
      details: "수집 실패",
      errorLog: "TimeoutError: Page load exceeded 30s",
    },
    {
      id: 4,
      sourceName: "테크미디어",
      url: "https://techmedia.jp/news",
      timestamp: "2024/01/26 10:15:00",
      result: "SUCCESS",
      details: "총 8건 데이터 수집 완료",
      errorLog: "-",
    },
    {
      id: 5,
      sourceName: "Reddit",
      url: "https://reddit.com/r/technology",
      timestamp: "2024/01/26 10:20:22",
      result: "SUCCESS",
      details: "총 25건 데이터 수집 완료",
      errorLog: "-",
    },
    {
      id: 6,
      sourceName: "필리핀 커뮤니티",
      url: "https://philippine-forum.com",
      timestamp: "2024/01/26 10:25:11",
      result: "FAILURE",
      details: "수집 실패",
      errorLog: "ProxyError: Could not connect to Manila relay node",
    },
  ];

  return (
    <div className="p-8 w-full">
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">로그 관리</h1>
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
              className="pl-10 h-11 bg-white border-gray-200 rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all shadow-sm"
            />
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
                  에러 로그
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => router.push(`/logs/${log.id}`)}
                  className="group hover:bg-gray-50/80 transition-all cursor-pointer"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {log.sourceName}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-xs text-gray-400 font-medium truncate font-mono">
                      {log.url}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-600 font-medium font-mono">
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`font-bold px-2.5 py-1 rounded-lg shadow-none border flex items-center gap-1.5 ${log.result === "SUCCESS"
                          ? "bg-primary-50 text-primary-600 border-primary-100"
                          : "bg-primary-900 text-white border-primary-900"
                          }`}
                      >
                        {log.result === "SUCCESS" ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        {log.result === "SUCCESS" ? "SUCCESS" : "FAIL"}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className={`text-sm font-medium ${log.result === "FAILURE" ? "text-rose-500" : "text-gray-400 italic"}`}>
                      {log.errorLog}
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
