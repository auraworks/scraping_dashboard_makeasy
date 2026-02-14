"use client";

import React from "react";
import {
  TrendingUp,
  CheckSquare,
  Filter,
  ChevronLeft,
  ChevronRight,
  Database,
  FileText,
  Activity,
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
import { Line, Bar, Doughnut } from "react-chartjs-2";

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

export default function Dashboard() {
  // KPI 데이터
  const stats = [
    {
      title: "총 수집 문서",
      subtitle: "전체 소스 누적 데이터",
      value: "1,284,392",
      icon: <Database className="w-5 h-5 text-primary-500" />,
      footer: "전일 대비 +1.2%",
      footerColor: "text-emerald-600",
      chartData: [65, 75, 70, 80, 85, 90, 95]
    },
    {
      title: "금일 신규 수집",
      subtitle: "실시간 수집 현황",
      value: "14,205",
      icon: <Server className="w-5 h-5 text-blue-500" />,
      footer: "지난 시간 대비 +320건",
      footerColor: "text-blue-600",
      chartData: [20, 40, 30, 50, 40, 60, 80]
    },


  ];

  // 최근 선정된 뉴스 데이터
  const recentIssues = [
    {
      id: 1,
      source: "네이버 뉴스",
      icon: "📰",
      title: "AI 기술 발전과 일자리 변화 보고서",
      category: "IT/과학",
      importance: "상",
      status: "분석완료",
      progress: 100
    },
    {
      id: 2,
      source: "블라인드",
      icon: "💬",
      title: "2024년 상반기 채용 트렌드 분석",
      category: "사회/노동",
      importance: "중",
      status: "검토중",
      progress: 60
    },
    {
      id: 3,
      source: "다음 뉴스",
      icon: "📰",
      title: "글로벌 경제 위기 대응 전략",
      category: "경제",
      importance: "상",
      status: "선별완료",
      progress: 85
    },
    {
      id: 4,
      source: "인스타그램",
      icon: "📱",
      title: "MZ세대 소비 패턴 변화 (해시태그 분석)",
      category: "라이프스타일",
      importance: "중",
      status: "수집중",
      progress: 45
    },
    {
      id: 5,
      source: "트위터(X)",
      icon: "🐦",
      title: "신규 스마트폰 출시 반응 모니터링",
      category: "IT/테크",
      importance: "하",
      status: "대기",
      progress: 10
    }
  ];

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
        ticks: { font: { size: 10 } }
      },
      y: {
        grid: { color: "#f3f4f6" },
        ticks: { display: false }
      }
    }
  };

  // 1. 수집 트래픽 차트 (Line)
  const trafficChartData = {
    labels: ["00시", "04시", "08시", "12시", "16시", "20시", "24시"],
    datasets: [
      {
        label: "수집 문서 수",
        data: [1200, 1900, 3000, 5000, 4200, 6000, 3500],
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

  // 2. 카테고리별 분류 현황 (Bar)
  const categoryChartData = {
    labels: ["경제", "정치", "사회", "IT/과학", "라이프", "연예"],
    datasets: [
      {
        label: "문서 수",
        data: [4500, 3200, 2800, 5100, 2400, 1800],
        backgroundColor: [
          "#1F2C5C", // Darkest
          "#2A3C72",
          "#364D89",
          "#425FA2",
          "#5373BD",
          "#6B8AD9", // Lightest
        ],
        borderRadius: 4,
      },
    ],
  };

  // 3. 소스별 점유율 (Doughnut)
  const sourceChartData = {
    labels: ["네이버", "다음", "커뮤니티", "SNS", "기타"],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary-500 text-white rounded-3xl p-8 md:p-10 mb-8 mx-6 mt-6 relative overflow-hidden shadow-lg shadow-primary-900/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
              통합 데이터 수집 대시보드
            </h1>
            <p className="text-primary-100 text-lg mb-6 max-w-xl leading-relaxed">
              다양한 채널에서 실시간으로 데이터를 수집하고, AI 분석을 통해 가치 있는 이슈를 발굴하세요.
              현재 <strong>5개 채널</strong>이 정상 작동 중입니다.
            </p>
            <div className="flex gap-3">

            </div>
          </div>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-20"></div>
      </div>

      <div className="px-6 pb-8">
        {/* KPI Cards - 2 Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">{stat.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>
                </div>
              </div>

              {/* Mini Sparkline */}
              <div className="flex items-end gap-1 h-16 mb-4">
                {stat.chartData.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                    style={{ height: `${val}%` }}
                  ></div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                <TrendingUp className="w-3 h-3 text-primary-500" />
                <p className={`text-xs font-semibold ${stat.footerColor}`}>{stat.footer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section - 2 Graphs Side by Side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Main Traffic Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">실시간 수집 트래픽</h3>
                <p className="text-xs text-gray-500 mt-1">시간대별 문서 수집 추이</p>
              </div>
              <select className="text-xs border-gray-200 rounded-lg px-2 py-1 bg-gray-50 text-gray-600 focus:ring-primary-500 focus:border-primary-500">
                <option>오늘</option>
                <option>어제</option>
                <option>지난 7일</option>
              </select>
            </div>
            <div className="h-64">
              <Line data={trafficChartData} options={commonOptions} />
            </div>
          </div>

          {/* Source Distribution Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col h-full items-center justify-center">
              <div className="text-center mb-8">
                <h3 className="text-lg font-bold text-gray-900">데이터 소스 점유율</h3>
                <p className="text-xs text-gray-500 mt-1">채널별 수집 비중</p>
              </div>
              <div className="w-full h-80 flex items-center justify-center">
                <Doughnut data={sourceChartData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        boxWidth: 8,
                        padding: 20,
                        font: { size: 11 }
                      }
                    }
                  }
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section - Full Width */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">최근 수집된 주요 이슈</h2>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                실시간 업데이트 중
              </p>
            </div>
            <div className="flex items-center gap-2">
              
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">출처</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">이슈 제목</th>
                  
                  

                </tr>
              </thead>
              <tbody>
                {recentIssues.map((issue) => (
                  <tr key={issue.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-gray-700">{issue.source}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {issue.title}
                        </span>
                        <span className="text-xs text-gray-400 mt-0.5">{issue.category}</span>
                      </div>
                    </td>
                    
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4">
            <span className="text-xs text-gray-400">1-5 of 42 items</span>
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
