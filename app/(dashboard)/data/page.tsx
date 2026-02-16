"use client";

import React from "react";
import { Search, FileSpreadsheet } from "lucide-react";
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
import { useState } from "react";

const COUNTRIES = [
  "대한민국", "가나", "과테말라", "그리스", "나이지리아", "남아프리카공화국", "네덜란드", "뉴질랜드", "대만", "독일", "도미니카공화국", "라오스", "러시아", "루마니아", "리투아니아", "말레이시아", "멕시코", "모로코", "몽골", "미국", "미얀마", "베네수엘라", "베트남", "벨기에", "벨라루스", "브라질", "불가리아", "방글라데시", "사우디아라비아", "세르비아", "수단", "스리랑카", "스웨덴", "스위스", "스페인", "슬로바키아", "싱가포르", "아랍에미리트", "아르메니아", "아르헨티나", "아제르바이잔", "알제리", "에콰도르", "에티오피아", "영국", "오만", "오스트리아", "우간다", "우즈베키스탄", "우크라이나", "이라크", "이란", "이스라엘", "이집트", "이탈리아", "인도", "인도네시아", "일본", "중국", "짐바브웨", "체코", "칠레", "카자흐스탄", "카타르", "캄보디아", "캐나다", "케냐", "코스타리카", "코트디부아르", "콜롬비아", "쿠바", "쿠웨이트", "크로아티아", "키르기스스탄", "태국", "탄자니아", "터키 (튀르키예)", "튀니지", "파나마", "파라과이", "파키스탄", "페루", "포르투갈", "폴란드", "프랑스", "핀란드", "필리핀", "헝가리", "호주", "홍콩"
].sort((a, b) => {
  if (a === "대한민국") return -1;
  if (b === "대한민국") return 1;
  return a.localeCompare(b, 'ko');
});

const TYPES = ["뉴스", "커뮤니티", "SNS", "블로그", "카페", "기타"];

export default function DataPage() {
  const router = useRouter();
  const [date, setDate] = useState<Date>();

  // 이슈ID 형식: 정보원ID(5자리) + 수집일(6자리, YYMMDD) + 수집문건순서(5자리)
  const dataItems = [
    {
      id: "0000124012600001", // 정보원ID: 00001, 수집일: 240126, 순서: 00001
      country: "대한민국",
      title: "2024년 금리 인하 관련 뉴스 속보 모음",
      source: "네이버 뉴스",
      type: "뉴스",
      collected_at: "24/01/26 10:05",
      published_at: "24/01/26 09:30",
    },
    {
      id: "0000224012600015", // 정보원ID: 00002, 수집일: 240126, 순서: 00015
      country: "미국",
      title: "MZ세대 트렌드 분석을 위한 인스타그램 태그",
      source: "인스타그램",
      type: "SNS",
      collected_at: "24/01/26 10:03",
      published_at: "24/01/26 08:00",
    },
    {
      id: "0000324012600008", // 정보원ID: 00003, 수집일: 240126, 순서: 00008
      country: "대한민국",
      title: "부동산 시장 동향 사용자 반응",
      source: "다음 아고라",
      type: "커뮤니티",
      collected_at: "24/01/26 09:45",
      published_at: "24/01/26 07:15",
    },
    {
      id: "0000424012600023", // 정보원ID: 00004, 수집일: 240126, 순서: 00023
      country: "일본",
      title: "AI 기술 발전에 따른 일자리 변화",
      source: "테크미디어",
      type: "뉴스",
      collected_at: "24/01/26 09:15",
      published_at: "24/01/25 18:00",
    },
    {
      id: "0000524012600003", // 정보원ID: 00005, 수집일: 240126, 순서: 00003
      country: "대한민국",
      title: "맛집 검색어 트렌드 상위 100",
      source: "구글 트렌드",
      type: "기타",
      collected_at: "24/01/26 08:30",
      published_at: "24/01/25 15:00",
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
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select>
              <SelectTrigger className="w-[125px] h-11 bg-white border-gray-200 rounded-xl shadow-sm">
                <SelectValue placeholder="모든 국가" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">모든 국가</SelectItem>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[120px] h-11 bg-white border-gray-200 rounded-xl shadow-sm">
                <SelectValue placeholder="모든 유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 유형</SelectItem>
                {TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[160px] h-11 justify-start text-left font-normal bg-white border-gray-200 rounded-xl shadow-sm",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ko }) : <span>발행일 선택</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
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
              onClick={() => setDate(undefined)}
            >
              초기화
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[15%]">
                  이슈 ID
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
              {dataItems.map((item) => (
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
                      {item.country}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors truncate">
                      {item.title}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-600 font-medium">
                      {item.source}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-600 font-medium">
                      {item.collected_at}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-600 font-medium">
                      {item.published_at}
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
