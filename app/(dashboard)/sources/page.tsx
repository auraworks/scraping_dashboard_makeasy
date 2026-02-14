"use client";

import React from "react";
import { Search, Filter, MoreHorizontal, Plus, Download, FileSpreadsheet } from "lucide-react";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const COUNTRIES = [
  "대한민국", "가나", "과테말라", "그리스", "나이지리아", "남아프리카공화국", "네덜란드", "뉴질랜드", "대만", "독일", "도미니카공화국", "라오스", "러시아", "루마니아", "리투아니아", "말레이시아", "멕시코", "모로코", "몽골", "미국", "미얀마", "베네수엘라", "베트남", "벨기에", "벨라루스", "브라질", "불가리아", "방글라데시", "사우디아라비아", "세르비아", "수단", "스리랑카", "스웨덴", "스위스", "스페인", "슬로바키아", "싱가포르", "아랍에미리트", "아르메니아", "아르헨티나", "아제르바이잔", "알제리", "에콰도르", "에티오피아", "영국", "오만", "오스트리아", "우간다", "우즈베키스탄", "우크라이나", "이라크", "이란", "이스라엘", "이집트", "이탈리아", "인도", "인도네시아", "일본", "중국", "짐바브웨", "체코", "칠레", "카자흐스탄", "카타르", "캄보디아", "캐나다", "케냐", "코스타리카", "코트디부아르", "콜롬비아", "쿠바", "쿠웨이트", "크로아티아", "키르기스스탄", "태국", "탄자니아", "터키 (튀르키예)", "튀니지", "파나마", "파라과이", "파키스탄", "페루", "포르투갈", "폴란드", "프랑스", "핀란드", "필리핀", "헝가리", "호주", "홍콩"
].sort((a, b) => {
  if (a === "대한민국") return -1;
  if (b === "대한민국") return 1;
  return a.localeCompare(b, 'ko');
});

const TYPES = ["뉴스", "커뮤니티", "SNS", "블로그", "카페", "기타"];

export default function SourcesPage() {
  const router = useRouter();
  const sources = [
    {
      id: 1,
      country: "대한민국",
      name: "네이버 뉴스",
      url: "https://news.naver.com",
      type: "뉴스",
      cycle: "일주일",
      status: "수집중",
      last_collected: "24/01/26 10:00",
      created_at: "24/01/01",
    },
    {
      id: 2,
      country: "대한민국",
      name: "다음 뉴스",
      url: "https://news.daum.net",
      type: "뉴스",
      cycle: "일주일",
      status: "대기",
      last_collected: "24/01/26 09:30",
      created_at: "24/01/01",
    },
    {
      id: 3,
      country: "대한민국",
      name: "네이트 판",
      url: "https://pann.nate.com",
      type: "커뮤니티",
      cycle: "일주일",
      status: "수집중",
      last_collected: "24/01/26 08:00",
      created_at: "24/01/05",
    },
    {
      id: 4,
      country: "대한민국",
      name: "디시인사이드",
      url: "https://dcinside.com",
      type: "커뮤니티",
      cycle: "일주일",
      status: "대기",
      last_collected: "24/01/25 23:00",
      created_at: "24/01/10",
    },
    {
      id: 5,
      country: "미국",
      name: "인스타그램",
      url: "https://instagram.com",
      type: "SNS",
      cycle: "일주일",
      status: "수집중",
      last_collected: "24/01/25 18:00",
      created_at: "24/01/15",
    },
  ];

  return (
    <div className="p-8 w-full">
      {/* 헤더 섹션 */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">정보원 관리</h1>
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

              <Select>
                <SelectTrigger className="w-[110px] h-11 bg-white border-gray-200 rounded-xl shadow-sm">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="수집중">수집중</SelectItem>
                  <SelectItem value="대기">대기</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="h-11 px-4 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-600 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                엑셀 다운로드
              </Button>

              <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block" />

              <Button variant="ghost" className="h-11 px-2 text-gray-400 hover:text-primary-600 font-bold">
                초기화
              </Button>
            </div>
          </div>
        </div>

        {/* 실제 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-16">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-24">
                  국가
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  정보원명
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-28">
                  유형
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-28">
                  수집 주기
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider w-24">
                  상태
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-40">
                  마지막 수집
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-32">
                  등록일
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {sources.map((source) => (
                <tr
                  key={source.id}
                  onClick={() => router.push(`/sources/${source.id}`)}
                  className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-mono text-gray-400">
                    #{source.id}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-600">
                      {source.country}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900 leading-tight">
                      {source.name}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-xs text-gray-400 font-medium max-w-[200px] truncate">
                      {source.url}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {source.type.split(',').map((t, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-600 font-medium">
                      {source.cycle}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <Badge
                      className={`${source.status === "수집중"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                        } border px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-none`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${source.status === "수집중" ? "bg-emerald-500" : "bg-amber-500"
                        }`} />
                      {source.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600 font-medium">{source.last_collected}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400">
                    {source.created_at}
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
