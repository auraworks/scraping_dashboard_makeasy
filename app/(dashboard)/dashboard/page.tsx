import React from "react";
import { Search, Filter, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
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

export default function Dashboard() {
  const authors = [
    {
      id: 1,
      name: "김철수",
      email: "kim@mail.com",
      function: "관리자",
      department: "조직",
      status: "온라인",
      employed: "23/04/18",
      avatar: "👨‍💼",
    },
    {
      id: 2,
      name: "이영희",
      email: "lee@mail.com",
      function: "개발자",
      department: "개발팀",
      status: "오프라인",
      employed: "11/01/19",
      avatar: "👩‍💻",
    },
    {
      id: 3,
      name: "박준호",
      email: "park@mail.com",
      function: "임원",
      department: "프로젝트",
      status: "오프라인",
      employed: "19/09/17",
      avatar: "👨‍💼",
    },
    {
      id: 4,
      name: "정미영",
      email: "jung@mail.com",
      function: "개발자",
      department: "개발팀",
      status: "온라인",
      employed: "24/12/08",
      avatar: "👩‍💻",
    },
    {
      id: 5,
      name: "최동욱",
      email: "choi@mail.com",
      function: "관리자",
      department: "임원진",
      status: "오프라인",
      employed: "04/10/21",
      avatar: "👨‍💼",
    },
    {
      id: 6,
      name: "한소연",
      email: "han@mail.com",
      function: "개발자",
      department: "개발팀",
      status: "오프라인",
      employed: "14/09/20",
      avatar: "👩‍💻",
    },
  ];

  return (
    <div className="p-8 w-full">
      {/* 헤더 섹션 */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">대시보드</h1>
          <p className="text-gray-500 text-lg">
            사용자 데이터 수집 현황 및 관리자 목록을 한눈에 확인하세요.
          </p>
        </div>
        <div className="flex items-center gap-3">
          
          <button className="px-4 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-all shadow-sm shadow-primary-200">
            새 사용자 추가
          </button>
        </div>
      </div>

      {/* 저자 테이블 컨테이너 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ring-1 ring-black/5">
        {/* 검색 및 필터 바 */}
        <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              placeholder="이름 또는 이메일로 검색"
              className="pl-10 h-11 bg-white border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all shadow-sm"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select>
              <SelectTrigger className="w-[140px] h-11 bg-white border-gray-200 rounded-xl shadow-sm focus:ring-primary-500/20">
                <SelectValue placeholder="모든 직책" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 직책</SelectItem>
                <SelectItem value="admin">관리자</SelectItem>
                <SelectItem value="dev">개발자</SelectItem>
                <SelectItem value="exec">임원</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[140px] h-11 bg-white border-gray-200 rounded-xl shadow-sm focus:ring-primary-500/20">
                <SelectValue placeholder="모든 상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="online">온라인</SelectItem>
                <SelectItem value="offline">오프라인</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  사용자 정보
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  직책 및 팀
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                  현재 상태
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  합류일
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {authors.map((author) => (
                <tr
                  key={author.id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      
                      <div>
                        <div className="text-sm font-bold text-gray-900 leading-tight">
                          {author.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5 font-medium">
                          {author.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-800">
                      {author.function}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 font-medium">
                      {author.department}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <Badge
                      className={`font-bold px-3 py-1 rounded-xl shadow-none border ${
                        author.status === "온라인"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-gray-50 text-gray-500 border-gray-100"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        author.status === "온라인" ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                      }`} />
                      {author.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-bold">
                    {author.employed}
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
                <PaginationLink 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-white border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
                >
                  3
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
