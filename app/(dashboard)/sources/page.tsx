"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Loader2,
  ChevronsUpDown,
  Check,
} from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSourceList, useBulkUpdateSourceStatus } from "@/components/hooks/sources";
import { useCategories } from "@/components/hooks/categories";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/hooks/useToast";
import type { Country } from "@/types/database";

const COUNTRIES = [
  "대한민국",
  "가나",
  "과테말라",
  "그리스",
  "나이지리아",
  "남아프리카공화국",
  "네덜란드",
  "뉴질랜드",
  "대만",
  "독일",
  "도미니카공화국",
  "라오스",
  "러시아",
  "루마니아",
  "리투아니아",
  "말레이시아",
  "멕시코",
  "모로코",
  "몽골",
  "미국",
  "미얀마",
  "베네수엘라",
  "베트남",
  "벨기에",
  "벨라루스",
  "브라질",
  "불가리아",
  "방글라데시",
  "사우디아라비아",
  "세르비아",
  "수단",
  "스리랑카",
  "스웨덴",
  "스위스",
  "스페인",
  "슬로바키아",
  "싱가포르",
  "아랍에미리트",
  "아르메니아",
  "아르헨티나",
  "아제르바이잔",
  "알제리",
  "에콰도르",
  "에티오피아",
  "영국",
  "오만",
  "오스트리아",
  "우간다",
  "우즈베키스탄",
  "우크라이나",
  "이라크",
  "이란",
  "이스라엘",
  "이집트",
  "이탈리아",
  "인도",
  "인도네시아",
  "일본",
  "중국",
  "짐바브웨",
  "체코",
  "칠레",
  "카자흐스탄",
  "카타르",
  "캄보디아",
  "캐나다",
  "케냐",
  "코스타리카",
  "코트디부아르",
  "콜롬비아",
  "쿠바",
  "쿠웨이트",
  "크로아티아",
  "키르기스스탄",
  "태국",
  "탄자니아",
  "터키 (튀르키예)",
  "튀니지",
  "파나마",
  "파라과이",
  "파키스탄",
  "페루",
  "포르투갈",
  "폴란드",
  "프랑스",
  "핀란드",
  "필리핀",
  "헝가리",
  "호주",
  "홍콩",
].sort((a, b) => {
  if (a === "대한민국") return -1;
  if (b === "대한민국") return 1;
  return a.localeCompare(b, "ko");
});

export default function SourcesPage() {
  const router = useRouter();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedCat1, setSelectedCat1] = useState<string>("all");
  const [selectedCat2, setSelectedCat2] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [countryOpen, setCountryOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // 유형1 목록 (독립)
  const { data: cat1List = [] } = useCategories(1);
  const cat1NameSet = new Set(cat1List.map(c => c.name));
  // 유형2 목록 (독립)
  const { data: cat2List = [] } = useCategories(2);

  const {
    data: sourcesData,
    isLoading,
    error,
  } = useSourceList({
    search: searchTerm || undefined,
    country:
      selectedCountry !== "all" ? (selectedCountry as Country) : undefined,
    category: selectedCat2 !== "all" ? selectedCat2 : undefined,
    categoryParent:
      selectedCat1 !== "all" && selectedCat2 === "all"
        ? selectedCat1
        : undefined,
    page,
    pageSize,
  });

  const sources = sourcesData?.data || [];
  const totalPages = sourcesData?.totalPages || 1;
  const total = sourcesData?.total || 0;

  const bulkUpdateMutation = useBulkUpdateSourceStatus();
  const isAllSelected = sources.length > 0 && sources.every((s) => selectedIds.has(s.id));
  const isIndeterminate = sources.some((s) => selectedIds.has(s.id)) && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sources.map((s) => s.id)));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkStatus = async (isLive: boolean) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      await bulkUpdateMutation.mutateAsync({ ids, isLive });
      toast.success("일괄 변경 완료", `${ids.length}개 정보원을 ${isLive ? "수집함" : "수집안함"}으로 변경했습니다.`);
      setSelectedIds(new Set());
    } catch (err) {
      toast.error("변경 실패", (err as Error).message);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(new Date(dateString).getTime() - 9 * 60 * 60 * 1000);

    return date
      .toLocaleDateString("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, "/")
      .replace(/\./, "");
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setPage(1);
    setCountryOpen(false);
  };

  const handleCat1Change = (value: string) => {
    setSelectedCat1(value);
    setSelectedCat2("all"); // 유형1 변경 시 유형2 초기화
    setPage(1);
  };

  const handleCat2Change = (value: string) => {
    setSelectedCat2(value);
    setPage(1);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCountry("all");
    setSelectedCat1("all");
    setSelectedCat2("all");
    setPage(1);
  };

  return (
    <div className="p-8 w-full">
      {/* 헤더 섹션 */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
            정보원 관리
          </h1>
          <p className="text-gray-500 text-lg">
            데이터 수집 정보원을 등록하고 관리합니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push("/sources/new")}
            className="px-5 py-6 bg-primary-500 text-white rounded-xl text-base font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            새 정보원 추가
          </Button>
        </div>
      </div>

      {/* 테이블 컨테이너 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ring-1 ring-black/5">
        {/* 검색 및 필터 바 */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="relative w-full xl:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                placeholder="정보원명 또는 URL 검색"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-11 bg-white border-gray-200 rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500 transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* 일괄 변경 버튼 (체크 시 표시) */}
              {selectedIds.size > 0 && (
                <>
                  <span className="text-sm font-medium text-gray-500">
                    {selectedIds.size}개 선택됨
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleBulkStatus(true)}
                    disabled={bulkUpdateMutation.isPending}
                    className="h-11 px-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-sm"
                  >
                    {bulkUpdateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "수집함으로 변경"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBulkStatus(false)}
                    disabled={bulkUpdateMutation.isPending}
                    className="h-11 px-4 bg-gray-400 text-white rounded-xl font-bold hover:bg-gray-500 shadow-sm"
                  >
                    {bulkUpdateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "수집안함으로 변경"}
                  </Button>
                </>
              )}
              {/* 국가 검색 Combobox */}
              <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={countryOpen}
                    className="w-[140px] h-11 justify-between bg-white border-gray-200 rounded-xl shadow-sm font-medium text-sm hover:bg-gray-50"
                  >
                    {selectedCountry === "all"
                      ? "모든 국가"
                      : selectedCountry}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="국가 검색..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>검색 결과 없음</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="__all__"
                          onSelect={() => handleCountryChange("all")}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              selectedCountry === "all"
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          모든 국가
                        </CommandItem>
                        {COUNTRIES.map((country) => (
                          <CommandItem
                            key={country}
                            value={country}
                            onSelect={() => handleCountryChange(country)}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selectedCountry === country
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            {country}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* 유형1 드롭다운 */}
              <Select
                value={selectedCat1}
                onValueChange={handleCat1Change}
              >
                <SelectTrigger className="w-[130px] h-11 bg-white border-gray-200 rounded-xl shadow-sm">
                  <SelectValue placeholder="모든 유형1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 유형1</SelectItem>
                  {cat1List.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 유형2 드롭다운 (유형1 선택 시 활성화) */}
              <Select
                value={selectedCat2}
                onValueChange={handleCat2Change}
                disabled={selectedCat1 === "all"}
              >
                <SelectTrigger className="w-[130px] h-11 bg-white border-gray-200 rounded-xl shadow-sm disabled:opacity-50">
                  <SelectValue placeholder={
                    selectedCat1 === "all"
                      ? "유형1을 먼저 선택"
                      : "모든 유형2"
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 유형2</SelectItem>
                  {cat2List.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                onClick={handleReset}
                className="h-11 px-2 text-gray-400 hover:text-primary-600 font-bold"
              >
                초기화
              </Button>
            </div>
          </div>
        </div>

        {/* 실제 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100">
                <th className="px-4 py-4 w-[4%]">
                  <Checkbox
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) (el as HTMLButtonElement & { indeterminate?: boolean }).indeterminate = isIndeterminate;
                    }}
                    onCheckedChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[5%]">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[10%]">
                  수집 상태
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[10%]">
                  국가
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[15%]">
                  정보원명
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[20%]">
                  URL
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[8%]">
                  유형1
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[12%]">
                  유형2
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[10%]">
                  수집 주기
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[10%]">
                  등록일
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-16 text-center">
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
                  <td colSpan={10} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-red-500 font-medium">
                        데이터를 불러오는 중 오류가 발생했습니다.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : sources.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-gray-400 font-medium">
                        등록된 정보원이 없습니다.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                sources.map((source) => (
                  <tr
                    key={source.id}
                    onClick={() => router.push(`/sources/${source.id}`)}
                    className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <td
                      className="px-4 py-5 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selectedIds.has(source.id)}
                        onCheckedChange={() => toggleSelect(source.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-mono text-gray-400 truncate">
                      #{source.id}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {source.is_live ? (
                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50 font-bold px-2.5 py-0.5 rounded-lg text-[11px]">
                          수집함
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-50 font-bold px-2.5 py-0.5 rounded-lg text-[11px]">
                          수집안함
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-600 truncate">
                        {source.country}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 leading-tight truncate">
                        {source.name}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-xs text-gray-400 font-medium truncate">
                        {source.url}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(source.category) && source.category.some(c => cat1NameSet.has(c)) ? (
                          source.category.filter(c => cat1NameSet.has(c)).map((t, i) => (
                            <Badge
                              key={i}
                              className="bg-primary-500 text-white border-none px-2 py-0.5 rounded-lg text-[10px] font-bold"
                            >
                              {t}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-300 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(source.category) && source.category.some(c => !cat1NameSet.has(c)) ? (
                          source.category.filter(c => !cat1NameSet.has(c)).map((t, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="bg-primary-50 text-primary-600 border-none px-2 py-0.5 rounded-lg text-[10px] font-bold"
                            >
                              {t}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-300 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-600 font-medium">
                        {source.frequency ? `${source.frequency}일` : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400">
                      {formatDate(source.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 섹션 */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-row items-center justify-between gap-4 bg-gray-50/20">
          <div className="flex items-center gap-3">
            {/* <div className="text-sm text-gray-500">
              총 <span className="font-bold text-gray-700">{total}</span>개의 정보원
            </div> */}
            <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-[120px] h-9 bg-white border-gray-200 rounded-xl shadow-sm text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10개씩 보기</SelectItem>
                <SelectItem value="100">100개씩 보기</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
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
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Input
                type="number"
                min={1}
                max={totalPages}
                key={page}
                defaultValue={page}
                className="w-16 h-9 text-center rounded-xl border-gray-200 bg-white shadow-sm text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const v = Number((e.target as HTMLInputElement).value);
                    if (v >= 1 && v <= totalPages) setPage(v);
                  }
                }}
              />
              <span>/ {totalPages}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
