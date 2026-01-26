import React from "react";
import { Search, Filter, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function LogsPage() {
  const logs = [
    {
      id: 1,
      level: "INFO",
      message: "네이버 뉴스 크롤링 작업이 성공적으로 시작되었습니다.",
      module: "CrawlerService",
      timestamp: "24/01/26 10:00:01",
      user: "System",
    },
    {
      id: 2,
      level: "WARN",
      message: "API 응답 지연 발생 (Time: 3500ms)",
      module: "NetworkLayer",
      timestamp: "24/01/26 10:00:05",
      user: "System",
    },
    {
      id: 3,
      level: "ERROR",
      message: "데이터베이스 연결 실패: Connection timeout",
      module: "Database",
      timestamp: "24/01/26 09:58:12",
      user: "Admin",
    },
    {
      id: 4,
      level: "INFO",
      message: "사용자 로그인: kim@mail.com",
      module: "AuthService",
      timestamp: "24/01/26 09:55:00",
      user: "kim@mail.com",
    },
    {
      id: 5,
      level: "DEBUG",
      message: "주간 리포트 생성 프로세스 큐잉됨",
      module: "JobQueue",
      timestamp: "24/01/26 09:50:22",
      user: "System",
    },
  ];

  return (
    <div className="p-8 w-full">
      {/* 헤더 섹션 */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">로그 관리</h1>
          <p className="text-gray-500 text-lg">
            시스템 동작 로그를 실시간으로 모니터링합니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm">
            로그 다운로드
          </button>
        </div>
      </div>

      {/* 테이블 컨테이너 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ring-1 ring-black/5">
        {/* 검색 및 필터 바 */}
        <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              placeholder="로그 메시지 검색"
              className="pl-10 h-11 bg-white border-gray-200 rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all shadow-sm"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select>
              <SelectTrigger className="w-[140px] h-11 bg-white border-gray-200 rounded-xl shadow-sm focus:ring-primary-500/20">
                <SelectValue placeholder="로그 레벨" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 레벨</SelectItem>
                <SelectItem value="info">INFO</SelectItem>
                <SelectItem value="warn">WARN</SelectItem>
                <SelectItem value="error">ERROR</SelectItem>
                <SelectItem value="debug">DEBUG</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[140px] h-11 bg-white border-gray-200 rounded-xl shadow-sm focus:ring-primary-500/20">
                <SelectValue placeholder="모듈 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 모듈</SelectItem>
                <SelectItem value="crawler">Crawler</SelectItem>
                <SelectItem value="network">Network</SelectItem>
                <SelectItem value="database">Database</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  레벨
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  메시지
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  모듈 / 사용자
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  발생 시각
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                  상세
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <Badge
                      className={`font-bold px-2.5 py-0.5 rounded-lg shadow-none border ${
                        log.level === "INFO"
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : log.level === "WARN"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : log.level === "ERROR"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-gray-50 text-gray-600 border-gray-100"
                      }`}
                    >
                      {log.level}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="max-w-md truncate text-sm font-medium text-gray-900">
                      {log.message}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-700">
                      {log.module}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                      {log.user}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-mono">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <button className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
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
                <PaginationLink 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-white border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
                >
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
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
