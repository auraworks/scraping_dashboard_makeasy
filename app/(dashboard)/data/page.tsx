"use client";

import React, { useState, useMemo } from "react";
import { Search, FileSpreadsheet, Loader2 } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDataList, useCountries, useSourceCategories, type DataFilters } from "@/components/hooks/datas";
import type { DataWithSource, Country } from "@/types/database";

const PAGE_SIZE = 10;

// 날짜 포맷팅 함수
function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return format(date, "yy/MM/dd HH:mm", { locale: ko });
}

export default function DataPage() {
  const router = useRouter();

  // 필터 상태
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);

  // 국가 목록 조회 (sources에서 가져옴)
  const { data: countries = [] } = useCountries();

  // 유형(카테고리) 목록 조회 (sources에서 가져옴)
  const { data: categories = [] } = useSourceCategories();

  // 필터 객체 생성
  const filters: DataFilters = useMemo(() => {
    const result: DataFilters = {
      page: currentPage,
      pageSize: PAGE_SIZE,
    };
    if (search) result.search = search;
    if (selectedCountry !== "all") result.country = selectedCountry;
    if (selectedCategory !== "all") result.category = selectedCategory;
    if (selectedDate) result.publishedAt = format(selectedDate, "yyyy-MM-dd");
    return result;
  }, [search, selectedCountry, selectedCategory, selectedDate, currentPage]);

  // 데이터 조회
  const { data: response, isLoading, isError, error } = useDataList(filters);

  // 필터 초기화
  const handleReset = () => {
    setSearch("");
    setSelectedCountry("all");
    setSelectedCategory("all");
    setSelectedDate(undefined);
    setCurrentPage(1);
  };

  // 검색 실행
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
    }
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 페이지네이션 계산
  const totalPages = response?.totalPages ?? 0;
  const paginationItems = useMemo(() => {
    if (totalPages <= 1) return [];
    const items = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      items.push(i);
    }
    return items;
  }, [totalPages, currentPage]);

  const dataItems: DataWithSource[] = response?.data ?? [];

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
      </div>

      {/* 테이블 컨테이너 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ring-1 ring-black/5">
        {/* 검색 및 필터 바 */}
        <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full xl:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              placeholder="제목 또는 내용 검색"
              className="pl-10 h-11 bg-white border-gray-200 rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500 transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedCountry} onValueChange={(v) => { setSelectedCountry(v as Country | "all"); setCurrentPage(1); }}>
              <SelectTrigger className="w-[125px] h-11 bg-white border-gray-200 rounded-xl shadow-sm">
                <SelectValue placeholder="모든 국가" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">모든 국가</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[120px] h-11 bg-white border-gray-200 rounded-xl shadow-sm">
                <SelectValue placeholder="모든 유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 유형</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[160px] h-11 justify-start text-left font-normal bg-white border-gray-200 rounded-xl shadow-sm",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", { locale: ko }) : <span>발행일 선택</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => { setSelectedDate(d); setCurrentPage(1); }}
                  initialFocus
                  locale={ko}
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              className="h-11 px-4 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-600 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              엑셀 다운로드
            </Button>

            <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block" />

            <Button
              variant="ghost"
              className="h-11 px-2 text-gray-400 hover:text-primary-600 font-bold"
              onClick={handleReset}
            >
              초기화
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[10%]">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[10%]">
                  국가
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[30%]">
                  제목
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[12%]">
                  정보원
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[9%]">
                  유형
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[12%]">
                  수집일
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[12%]">
                  발행일
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                      <span className="text-gray-500 font-medium">데이터를 불러오는 중...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="text-red-500 font-medium">데이터를 불러오는데 실패했습니다.</span>
                      <span className="text-gray-400 text-sm">{error?.message}</span>
                    </div>
                  </td>
                </tr>
              ) : dataItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="text-gray-400 font-medium">데이터가 없습니다.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                dataItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => router.push(`/data/${item.id}`)}
                    className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-mono text-gray-500 truncate">
                      {item.id}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-600 truncate">
                        {item.sources?.country ?? "-"}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors truncate">
                        {item.title ?? "-"}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-600 font-medium">
                        {item.sources?.name ?? "-"}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          const cats =
                            (item.sources?.category as unknown as string[] | string | null) ??
                            item.category;
                          const list = Array.isArray(cats)
                            ? cats
                            : cats
                              ? [cats]
                              : [];
                          if (list.length === 0)
                            return <span className="text-gray-400 text-sm font-medium">-</span>;
                          return list.map((cat, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary-50 text-primary-600"
                            >
                              {cat}
                            </span>
                          ));
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-600 font-medium">
                        {formatDate(item.collected_at)}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-600 font-medium">
                        {formatDate(item.published_date)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 섹션 */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-row items-center justify-between gap-4 bg-gray-50/20">
          <div className="text-sm text-gray-500">
            총 {response?.total ?? 0}개 중 {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, response?.total ?? 0)}개 표시
          </div>
          {totalPages > 1 && (
            <Pagination className="mx-0 w-auto">
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (currentPage > 1) handlePageChange(currentPage - 1); }}
                    className={cn(
                      "rounded-xl border-gray-200 bg-white hover:bg-gray-50 h-10 px-4 transition-all",
                      currentPage === 1 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
                {paginationItems[0] > 1 && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(1); }}
                        className="w-10 h-10 rounded-xl bg-white border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {paginationItems[0] > 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}
                {paginationItems.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                      isActive={currentPage === page}
                      className={cn(
                        "w-10 h-10 rounded-xl font-bold transition-all",
                        currentPage === page
                          ? "bg-primary-500 text-white border-none shadow-md shadow-primary-200 hover:bg-primary-600"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {paginationItems[paginationItems.length - 1] < totalPages && (
                  <>
                    {paginationItems[paginationItems.length - 1] < totalPages - 1 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }}
                        className="w-10 h-10 rounded-xl bg-white border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) handlePageChange(currentPage + 1); }}
                    className={cn(
                      "rounded-xl border-gray-200 bg-white hover:bg-gray-50 h-10 px-4 transition-all",
                      currentPage === totalPages && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
