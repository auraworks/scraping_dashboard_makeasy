"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Database,
  Server
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  useDashboardSummary,
  useDataList,
  useLastCollectionDate,
  useWeeklyTrend,
  useMonthlyTrend,
  useSourceCountByCountry,
  useSourceCountByCat1,
  useSourceCountByCat2,
} from "@/components/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

// 막대 위에 값 표시하는 인라인 플러그인
const barValuePlugin = {
  id: "barValues",
  afterDatasetsDraw(chart: any) {
    const { ctx } = chart;
    chart.data.datasets.forEach((_dataset: any, datasetIndex: number) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      meta.data.forEach((bar: any, index: number) => {
        const value = chart.data.datasets[datasetIndex].data[index];
        if (value === null || value === undefined) return;
        ctx.save();
        ctx.fillStyle = "#374151";
        ctx.textAlign = "center";
        ctx.font = "bold 11px 'Pretendard', sans-serif";
        ctx.fillText(
          (value as number).toLocaleString("ko-KR"),
          bar.x,
          bar.y - 6
        );
        ctx.restore();
      });
    });
  },
};

// Number formatting utility
function formatNumber(num: number): string {
  return num.toLocaleString("ko-KR");
}

function generateColors(count: number): string[] {
  const base = [
    "#1F2C5C", "#324682", "#4C63A6", "#6E84C7", "#90A4D8",
    "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE",
    "#0F172A", "#1E3A5F", "#2D5986", "#3D7BAD", "#4D9DD4",
  ];
  return Array.from({ length: count }, (_, i) => base[i % base.length]);
}

function buildDoughnutData(items: { source: string; count: number }[]) {
  const labels = items.map((d) => d.source);
  const data = items.map((d) => d.count);
  return {
    labels,
    datasets: [{ data, backgroundColor: generateColors(items.length), borderWidth: 0 }],
  };
}

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [periodType, setPeriodType] = useState<"daily" | "weekly" | "monthly">("daily");

  // Fetch real data
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: recentData, isLoading: recentLoading } = useDataList({ page: currentPage, pageSize });
  const { data: sourceByCountry = [], isLoading: countryLoading } = useSourceCountByCountry();
  const { data: sourceByCat1 = [], isLoading: cat1Loading } = useSourceCountByCat1();
  const { data: sourceByCat2 = [], isLoading: cat2Loading } = useSourceCountByCat2();
  const { data: lastCollectedAt } = useLastCollectionDate();
  const { data: weeklyTrend = [], isLoading: weeklyLoading } = useWeeklyTrend();
  const { data: monthlyTrend = [], isLoading: monthlyLoading } = useMonthlyTrend();

  // summary에서 모든 값 파생 (단일 데이터 소스)
  const totalCount = summary?.totalCount ?? 0;
  const todayCount = summary?.todayCount ?? 0;
  const yesterdayCount = summary?.yesterdayCount ?? 0;
  const dailyTrend = summary?.dailyTrend ?? [];

  const dailyCounts = dailyTrend.map((d) => d.count);
  const dailyLabels = dailyTrend.map((d) => d.label);
  const dailyDates = dailyTrend.map((d) => d.date);
  const maxDaily = Math.max(...dailyCounts, 1);

  const diffFromYesterday = yesterdayCount > 0
    ? ((todayCount - yesterdayCount) / yesterdayCount * 100).toFixed(1)
    : todayCount > 0 ? "+100" : "0";

  // KPI 데이터
  const stats = [
    {
      title: "총 수집 문서",
      subtitle: "전체 소스 누적 데이터",
      value: summaryLoading ? "..." : formatNumber(totalCount),
      icon: <Database className="w-5 h-5 text-primary-500" />,
      footer: `전일 대비 ${Number(diffFromYesterday) >= 0 ? "+" : ""}${diffFromYesterday}%`,
      footerColor: Number(diffFromYesterday) >= 0 ? "text-emerald-600" : "text-red-500",
    },
    {
      title: "금일 신규 수집",
      subtitle: "실시간 수집 현황",
      value: summaryLoading ? "..." : formatNumber(todayCount),
      icon: <Server className="w-5 h-5 text-blue-500" />,
      footer: `어제 ${formatNumber(yesterdayCount)}건`,
      footerColor: "text-blue-600",
    },
  ];

  // 최근 선정된 뉴스 데이터
  const recentIssues = recentData?.data?.map((item) => ({
    id: item.id,
    source: item.sources?.name || "알 수 없음",
    icon: "📰",
    title: item.title || "제목 없음",
    category: item.category || item.sources?.category || "기타",
  })) || [];

  // 일별 수집 Bar 차트 옵션
  const dailyBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 24 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const val = ctx.parsed.y;
            return val !== null ? `${val.toLocaleString("ko-KR")}건` : "";
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: "#9ca3af" },
      },
      y: {
        grid: { color: "#f3f4f6" },
        ticks: { font: { size: 11 }, color: "#9ca3af", padding: 8 },
        beginAtZero: true,
      },
    },
  };

  // 현재 선택된 기간에 따른 차트 데이터
  const currentChartData = (() => {
    if (periodType === "weekly") {
      return {
        labels: weeklyTrend.map((d) => d.label),
        counts: weeklyTrend.map((d) => d.count),
        isLoading: weeklyLoading,
        subtitle: "최근 4주 수집 건수",
      };
    }
    if (periodType === "monthly") {
      return {
        labels: monthlyTrend.map((d) => d.label),
        counts: monthlyTrend.map((d) => d.count),
        isLoading: monthlyLoading,
        subtitle: "최근 12개월 수집 건수",
      };
    }
    return {
      labels: dailyTrend.map((d) => [d.date, d.label]),
      counts: dailyCounts,
      isLoading: summaryLoading,
      subtitle: "최근 7일 신규 수집 건수",
    };
  })();

  const currentBarChartData = {
    labels: currentChartData.labels as string[],
    datasets: [
      {
        label: "수집 건수",
        data: currentChartData.counts,
        backgroundColor: currentChartData.counts.map((_, i) =>
          i === currentChartData.counts.length - 1 ? "#3B82F6" : "#1F2C5C"
        ),
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const countryChartData = buildDoughnutData(sourceByCountry);
  const cat1ChartData = buildDoughnutData(sourceByCat1);
  const cat2ChartData = buildDoughnutData(sourceByCat2);

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <div className="bg-primary-500 text-white rounded-none md:rounded-3xl p-6 md:p-10 mb-6 md:mb-8 md:mx-6 mt-0 md:mt-6 relative overflow-hidden shadow-lg shadow-primary-900/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 tracking-tight">
              통합 데이터 수집 대시보드
            </h1>
            <p className="text-primary-100 text-sm md:text-lg mb-4 md:mb-6 leading-relaxed">
              다양한 채널에서 실시간으로 데이터를 수집하고, AI 분석을 통해 가치 있는 이슈를 발굴하세요.
            </p>
          </div>
          <div className="text-center md:text-right shrink-0">
            <p className="text-primary-200 text-xs mb-1">마지막 수집일</p>
            <p className="text-white text-sm md:text-base font-semibold">
              {lastCollectedAt
                ? new Intl.DateTimeFormat("ko-KR", {
                  timeZone: "Asia/Seoul",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(lastCollectedAt))
                : "-"}
            </p>
          </div>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-primary-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-blue-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-20"></div>
      </div>

      <div className="px-4 md:px-6 h-full">
        {/* KPI Cards - 2 Cards Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div>
                  <h3 className="text-xs md:text-sm font-semibold text-gray-500 mb-1">{stat.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 md:pt-3 border-t border-gray-50">
                <TrendingUp className="w-3 h-3 text-primary-500" />
                <p className={`text-xs font-semibold ${stat.footerColor}`}>{stat.footer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section - Stack vertically on mobile */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* 수집문건 현황 Bar Chart */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900">수집문건 현황</h3>
                <p className="text-xs text-gray-500 mt-1">{currentChartData.subtitle}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="inline-block w-3 h-3 rounded-sm bg-primary-500"></span>이전
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="inline-block w-3 h-3 rounded-sm bg-blue-500"></span>
                    {periodType === "daily" ? "오늘" : periodType === "weekly" ? "이번주" : "이번달"}
                  </span>
                </div>
                <Select value={periodType} onValueChange={(v) => setPeriodType(v as "daily" | "weekly" | "monthly")}>
                  <SelectTrigger className="w-[100px] h-9 bg-white border-gray-200 rounded-xl shadow-sm text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">일간</SelectItem>
                    <SelectItem value="weekly">주간</SelectItem>
                    <SelectItem value="monthly">월간</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="h-48 md:h-64">
              {currentChartData.isLoading ? (
                <div className="flex items-center justify-center h-full text-gray-400">로딩 중...</div>
              ) : (
                <Bar
                  data={currentBarChartData}
                  options={dailyBarOptions}
                  plugins={[barValuePlugin]}
                />
              )}
            </div>
          </div>

          {/* 정보원 보유 현황 - 3개 도넛 차트 */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900">정보원 보유 현황</h3>
              <p className="text-xs text-gray-500 mt-1">국가별 · 유형1별 · 유형2별 분포</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { title: "국가별", data: countryChartData, isLoading: countryLoading },
                { title: "유형1별", data: cat1ChartData, isLoading: cat1Loading },
                { title: "유형2별", data: cat2ChartData, isLoading: cat2Loading },
              ].map(({ title, data, isLoading }) => (
                <div key={title} className="flex flex-col items-center">
                  <p className="text-xs font-bold text-gray-600 mb-2">{title}</p>
                  <div className="w-full h-40 md:h-48">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full text-gray-400 text-xs">로딩 중...</div>
                    ) : (
                      <Doughnut
                        data={data}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "bottom",
                              labels: {
                                usePointStyle: true,
                                boxWidth: 6,
                                padding: 8,
                                font: { size: 9 },
                              },
                            },
                            tooltip: {
                              callbacks: {
                                label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed}개`,
                              },
                            },
                          },
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table Section - Full Width */}
        {/* <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
            <div>
              <h2 className="text-base md:text-lg font-bold text-gray-900">최근 수집된 주요 이슈</h2>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                매일 오전6시 업데이트
              </p>
            </div>
          </div>

          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">출처</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">이슈 제목</th>
                </tr>
              </thead>
              <tbody>
                {recentLoading ? (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-gray-400">로딩 중...</td>
                  </tr>
                ) : recentIssues.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-gray-400">데이터가 없습니다</td>
                  </tr>
                ) : (
                  recentIssues.map((issue) => (
                    <tr key={issue.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                      <td className="py-3 md:py-4 px-4">
                        <span className="text-xs md:text-sm font-semibold text-gray-700">{issue.source}</span>
                      </td>
                      <td className="py-3 md:py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-xs md:text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {issue.title}
                          </span>
                          <span className="text-xs text-gray-400 mt-0.5">{issue.category}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4">
            <span className="text-xs text-gray-400">
              {recentData?.total
                ? `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, recentData.total)} of ${recentData.total} items`
                : "0 items"}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 transition-all text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={!recentData?.total || currentPage * pageSize >= recentData.total}
                className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 transition-all text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
