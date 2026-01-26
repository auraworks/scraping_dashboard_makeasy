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

export default function DataPage() {
  const dataItems = [
    {
      id: 1,
      title: "2024년 금리 인하 관련 뉴스 속보 모음",
      source: "네이버 뉴스",
      category: "경제",
      status: "처리완료",
      collected_at: "24/01/26 10:05",
      format: "JSON",
    },
    {
      id: 2,
      title: "MZ세대 트렌드 분석을 위한 인스타그램 태그",
      source: "인스타그램",
      category: "라이프스타일",
      status: "처리중",
      collected_at: "24/01/26 10:03",
      format: "CSV",
    },
    {
      id: 3,
      title: "부동산 시장 동향 사용자 반응",
      source: "다음 아고라",
      category: "부동산",
      status: "대기",
      collected_at: "24/01/26 09:45",
      format: "JSON",
    },
    {
      id: 4,
      title: "AI 기술 발전에 따른 일자리 변화",
      source: "테크미디어",
      category: "IT/과학",
      status: "처리완료",
      collected_at: "24/01/26 09:15",
      format: "PDF",
    },
    {
      id: 5,
      title: "맛집 검색어 트렌드 상위 100",
      source: "구글 트렌드",
      category: "라이프스타일",
      status: "에러",
      collected_at: "24/01/26 08:30",
      format: "CSV",
    },
  ];

  return (
    <div className="p-8 w-full">
      {/* 헤더 섹션 */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">데이터 관리</h1>
          <p className="text-gray-500 text-lg">
            수집된 원본 데이터를 확인하고 가공 프로세스를 관리합니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-all shadow-sm shadow-primary-200">
            데이터 내보내기
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
              placeholder="제목 또는 내용 검색"
              className="pl-10 h-11 bg-white border-gray-200 rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all shadow-sm"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select>
              <SelectTrigger className="w-[140px] h-11 bg-white border-gray-200 rounded-xl shadow-sm focus:ring-primary-500/20">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="economy">경제</SelectItem>
                <SelectItem value="it">IT/과학</SelectItem>
                <SelectItem value="lifestyle">라이프스타일</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[140px] h-11 bg-white border-gray-200 rounded-xl shadow-sm focus:ring-primary-500/20">
                <SelectValue placeholder="처리 상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="completed">처리완료</SelectItem>
                <SelectItem value="processing">처리중</SelectItem>
                <SelectItem value="pending">대기</SelectItem>
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
                  데이터 제목
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  출처 / 포맷
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  카테고리
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  수집 시각
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {dataItems.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="max-w-xs truncate text-sm font-bold text-gray-900 leading-tight">
                        {item.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-700">
                      {item.source}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 font-medium uppercase">
                      {item.format}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <Badge variant="outline" className="text-gray-600 bg-gray-50 border-gray-200">
                      {item.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <Badge
                      className={`font-bold px-3 py-1 rounded-xl shadow-none border ${
                        item.status === "처리완료"
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : item.status === "처리중"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : item.status === "대기"
                          ? "bg-gray-50 text-gray-500 border-gray-100"
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        item.status === "처리중" ? "bg-amber-500 animate-pulse" 
                        : item.status === "처리완료" ? "bg-blue-500"
                        : item.status === "대기" ? "bg-gray-400"
                        : "bg-red-500"
                      }`} />
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-bold">
                    {item.collected_at}
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
