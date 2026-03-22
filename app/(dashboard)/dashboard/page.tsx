"use client";

import React from "react";
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
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import {
  useDashboardStats,
  useHourlyTraffic,
  useSourceDistribution,
  useDataList,
  useLastCollectionDate,
  useDailyTrend,
} from "@/components/hooks";

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Number formatting utility
function formatNumber(num: number): string {
  return num.toLocaleString("ko-KR");
}

export default function Dashboard() {
  // Fetch real data
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: hourlyData, isLoading: hourlyLoading } = useHourlyTraffic();
  const { data: sourceData, isLoading: sourceLoading } = useSourceDistribution();
  const { data: recentData, isLoading: recentLoading } = useDataList({ page: 1, pageSize: 5 });
  const { data: lastCollectedAt } = useLastCollectionDate();
  const { data: dailyTrend = [] } = useDailyTrend();

  // 일별 트렌드 데이터
  const dailyCounts = dailyTrend.map((d) => d.count);
  const dailyLabels = dailyTrend.map((d) => d.label);
  const dailyDates = dailyTrend.map((d) => d.date);
  const maxDaily = Math.max(...dailyCounts, 1);

  // 전일 대비 증감 계산
  const todayCount = dailyCounts[dailyCounts.length - 1] || 0;
  const yesterdayCount = dailyCounts.length >= 2 ? dailyCounts[dailyCounts.length - 2] : 0;
  const diffFromYesterday = yesterdayCount > 0
    ? ((todayCount - yesterdayCount) / yesterdayCount * 100).toFixed(1)
    : todayCount > 0 ? "+100" : "0";

  // KPI 데이터
  const stats = [
    {
      title: "총 수집 문서",
      subtitle: "전체 소스 누적 데이터",
      value: statsLoading ? "..." : formatNumber(statsData?.totalCount || 0),
      icon: <Database className="w-5 h-5 text-primary-500" />,
      footer: `전일 대비 ${Number(diffFromYesterday) >= 0 ? "+" : ""}${diffFromYesterday}%`,
      footerColor: Number(diffFromYesterday) >= 0 ? "text-emerald-600" : "text-red-500",
    },
    {
      title: "금일 신규 수집",
      subtitle: "실시간 수집 현황",
      value: statsLoading ? "..." : formatNumber(statsData?.todayCount || 0),
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

  // 차트 옵션 공통
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: "#9ca3af" }
      },
      y: {
        grid: { color: "#f3f4f6" },
        ticks: { display: true, font: { size: 11 }, color: "#9ca3af", padding: 8 },
        beginAtZero: true,
      }
    }
  };

  // 1. 수집 트래픽 차트 (Line)
  const trafficChartData = {
    labels: hourlyData?.map((d) => d.hour) || ["00시", "04시", "08시", "12시", "16시", "20시", "24시"],
    datasets: [
      {
        label: "수집 문서 수",
        data: hourlyData?.map((d) => d.count) || [0, 0, 0, 0, 0, 0, 0],
        borderColor: "#1F2C5C",
        backgroundColor: "rgba(31, 44, 92, 0.05)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "#1F2C5C",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  // 3. 소스별 점유율 (Doughnut)
  const sourceLabels = sourceData?.slice(0, 5).map((d) => d.source) || ["데이터 없음"];
  const sourceCounts = sourceData?.slice(0, 5).map((d) => d.count) || [1];

  const sourceChartData = {
    labels: sourceLabels,
    datasets: [
      {
        data: sourceCounts,
        backgroundColor: [
          "#1F2C5C", // Primary
          "#324682",
          "#4C63A6",
          "#6E84C7",
          "#E2E8F0", // Light Gray for 'Others'
        ],
        borderWidth: 0,
      },
    ],
  };

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

      <div className="px-4 md:px-6 pb-8">
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

              {/* Mini Sparkline */}
              <div className="mb-3 md:mb-4">
                <div className="flex items-end gap-1 h-12 md:h-16">
                  {dailyCounts.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                      <span className="text-[9px] text-gray-400 mb-0.5 font-medium">{formatNumber(val)}</span>
                      <div
                        className={`w-full rounded-t-sm opacity-80 hover:opacity-100 transition-opacity ${i === dailyCounts.length - 1 ? "bg-blue-500" : "bg-primary-500"}`}
                        style={{ height: `${maxDaily > 0 ? (val / maxDaily) * 100 : 0}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  {dailyDates.map((date, i) => (
                    <div key={i} className="flex flex-col items-center flex-1">
                      <span className="text-[9px] text-gray-400">{dailyLabels[i]}</span>
                    </div>
                  ))}
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
          {/* Main Traffic Chart */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900">실시간 수집 트래픽</h3>
                <p className="text-xs text-gray-500 mt-1">시간대별 문서 수집 추이</p>
              </div>
              <select className="text-xs border-gray-200 rounded-lg px-2 py-1 bg-gray-50 text-gray-600 focus:ring-primary-500 focus:border-primary-500 w-fit">
                <option>오늘</option>
                <option>어제</option>
                <option>지난 7일</option>
              </select>
            </div>
            <div className="h-48 md:h-64">
              {hourlyLoading ? (
                <div className="flex items-center justify-center h-full text-gray-400">로딩 중...</div>
              ) : (
                <Line data={trafficChartData} options={commonOptions} />
              )}
            </div>
          </div>

          {/* Source Distribution Chart */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col h-full items-center justify-center">
              <div className="text-center mb-4 md:mb-8">
                <h3 className="text-base md:text-lg font-bold text-gray-900">데이터 소스 점유율</h3>
                <p className="text-xs text-gray-500 mt-1">채널별 수집 비중</p>
              </div>
              <div className="w-full h-56 md:h-80 flex items-center justify-center">
                {sourceLoading ? (
                  <div className="flex items-center justify-center h-full text-gray-400">로딩 중...</div>
                ) : (
                  <Doughnut data={sourceChartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          usePointStyle: true,
                          boxWidth: 8,
                          padding: 15,
                          font: { size: 10 }
                        }
                      }
                    }
                  }} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table Section - Full Width */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 mb-6 md:mb-8">
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
              1-{Math.min(5, recentData?.total || 0)} of {recentData?.total || 0} items
            </span>
            <div className="flex gap-1">
              <button className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 transition-all text-gray-500 disabled:opacity-50">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 transition-all text-gray-500">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
