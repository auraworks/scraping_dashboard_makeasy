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

export default function IssueArchivePage() {
  const archives = [
    {
      id: 1,
      title: "2023년 하반기 소비자 트렌드 총결산 보고서",
      category: "연간 리포트",
      tags: ["2023", "트렌드", "소비자"],
      archived_at: "23/12/31",
      writer: "김철수",
      size: "15MB",
    },
    {
      id: 2,
      title: "생성형 AI 기술 발전 동향 및 전망",
      category: "기술 분석",
      tags: ["AI", "Tech", "미래전망"],
      archived_at: "23/11/15",
      writer: "이영희",
      size: "8.2MB",
    },
    {
      id: 3,
      title: "글로벌 경제 위기 대응 전략 케이스 스터디",
      category: "경제 리포트",
      tags: ["경제", "전략", "케이스스터디"],
      archived_at: "23/10/20",
      writer: "박준호",
      size: "12MB",
    },
    {
      id: 4,
      title: "MZ세대 소셜 미디어 이용 행태 분석",
      category: "마케팅",
      tags: ["SNS", "MZ세대", "마케팅"],
      archived_at: "23/09/05",
      writer: "최동욱",
      size: "24MB",
    },
    {
      id: 5,
      title: "친환경 에너지 정책 변화와 기업 대응",
      category: "정책 분석",
      tags: ["ESG", "친환경", "에너지"],
      archived_at: "23/08/12",
      writer: "한소연",
      size: "5.5MB",
    },
  ];

  return (
    <div className="p-8 w-full">
      {/* 헤더 섹션 */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">이슈 아카이브</h1>
          <p className="text-gray-500 text-lg">
            지난 이슈 및 분석 리포트를 검색하고 열람합니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm">
            일괄 다운로드
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
              placeholder="아카이브 제목 또는 태그 검색"
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
                <SelectItem value="report">리포트</SelectItem>
                <SelectItem value="tech">기술</SelectItem>
                <SelectItem value="marketing">마케팅</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[140px] h-11 bg-white border-gray-200 rounded-xl shadow-sm focus:ring-primary-500/20">
                <SelectValue placeholder="연도" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="2024">2024년</SelectItem>
                <SelectItem value="2023">2023년</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  아카이브 제목
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  카테고리 / 태그
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  작성자
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  저장일
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                  용량
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {archives.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="max-w-md truncate text-sm font-bold text-gray-900 leading-tight">
                      {item.title}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-700">
                      {item.category}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded font-medium">#{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-600">
                      {item.writer}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-mono font-bold">
                    {item.archived_at}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.size}
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
