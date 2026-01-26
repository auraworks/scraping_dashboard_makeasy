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

export default function SourcesPage() {
  const sources = [
    {
      id: 1,
      name: "네이버 뉴스",
      url: "https://news.naver.com",
      type: "뉴스",
      cycle: "1시간",
      status: "수집중",
      last_collected: "24/01/26 10:00",
    },
    {
      id: 2,
      name: "다음 뉴스",
      url: "https://news.daum.net",
      type: "뉴스",
      cycle: "1시간",
      status: "대기",
      last_collected: "24/01/26 09:30",
    },
    {
      id: 3,
      name: "네이트 판",
      url: "https://pann.nate.com",
      type: "커뮤니티",
      cycle: "6시간",
      status: "수집중",
      last_collected: "24/01/26 08:00",
    },
    {
      id: 4,
      name: "디시인사이드",
      url: "https://dcinside.com",
      type: "커뮤니티",
      cycle: "30분",
      status: "에러",
      last_collected: "24/01/25 23:00",
    },
    {
      id: 5,
      name: "인스타그램",
      url: "https://instagram.com",
      type: "SNS",
      cycle: "1일",
      status: "수집중",
      last_collected: "24/01/25 18:00",
    },
  ];

  return (
    <div className="p-8 w-full">
      {/* 헤더 섹션 */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">소스 관리</h1>
          <p className="text-gray-500 text-lg">
            데이터 수집 소스를 등록하고 관리합니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-all shadow-sm shadow-primary-200">
            새 소스 추가
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
              placeholder="소스명 또는 URL 검색"
              className="pl-10 h-11 bg-white border-gray-200 rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all shadow-sm"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select>
              <SelectTrigger className="w-[140px] h-11 bg-white border-gray-200 rounded-xl shadow-sm focus:ring-primary-500/20">
                <SelectValue placeholder="모든 유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 유형</SelectItem>
                <SelectItem value="news">뉴스</SelectItem>
                <SelectItem value="community">커뮤니티</SelectItem>
                <SelectItem value="sns">SNS</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[140px] h-11 bg-white border-gray-200 rounded-xl shadow-sm focus:ring-primary-500/20">
                <SelectValue placeholder="모든 상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="active">수집중</SelectItem>
                <SelectItem value="idle">대기</SelectItem>
                <SelectItem value="error">에러</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  소스명 / URL
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  유형
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  수집 주기
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  마지막 수집
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {sources.map((source) => (
                <tr
                  key={source.id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-bold text-gray-900 leading-tight">
                        {source.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 font-medium">
                        {source.url}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-600">
                      {source.type}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-600">
                      {source.cycle}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <Badge
                      className={`font-bold px-3 py-1 rounded-xl shadow-none border ${
                        source.status === "수집중"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : source.status === "대기"
                          ? "bg-gray-50 text-gray-500 border-gray-100"
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        source.status === "수집중" ? "bg-emerald-500 animate-pulse" 
                        : source.status === "대기" ? "bg-gray-400"
                        : "bg-red-500"
                      }`} />
                      {source.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-bold">
                    {source.last_collected}
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
