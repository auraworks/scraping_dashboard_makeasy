import React from "react";
import { DataForm } from "@/components/data/DataForm";

// Mock fetching function
async function getData(id: string) {
  // Demo mock data based on ID
  const items = [
    {
      issueId: "0000124012600001",
      title: "2024년 금리 인하 관련 뉴스 속보 모음",
      source: "네이버 뉴스",
      category: "경제",
      status: "처리완료",
      collectedAt: new Date("2024-01-26T10:05:00"),
      publishedAt: new Date("2024-01-26T09:30:00"),
      format: "JSON",
      content: "오늘 금융통화위원회는 기준금리를 동결하기로 결정했다...",
      country: "대한민국",
      type: "뉴스",
    },
    {
      issueId: "0000224012600015",
      title: "MZ세대 트렌드 분석을 위한 인스타그램 태그",
      source: "인스타그램",
      category: "라이프스타일",
      status: "처리중",
      collectedAt: new Date("2024-01-26T10:03:00"),
      publishedAt: new Date("2024-01-26T08:00:00"),
      format: "CSV",
      content: "#OOTD #DailyLook #CafeTour ...",
      country: "미국",
      type: "SNS",
    },
    // Add default fallback for others
    {
      issueId: id, // 요청된 ID를 그대로 사용
      title: "Sample Data Title",
      source: "Sample Source",
      category: "IT/과학",
      status: "대기",
      collectedAt: new Date("2024-01-26T09:00:00"),
      publishedAt: new Date("2024-01-26T07:00:00"),
      format: "JSON",
      content: "Sample content...",
      country: "대한민국",
      type: "기타",
    }
  ];

  return items.find((item) => item.issueId === id) || items[2];
}

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "default" }];
}

interface EditDataPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDataPage({ params }: EditDataPageProps) {
  const { id } = await params;
  const initialData = await getData(id);

  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">데이터 정보 수정</h1>
        <p className="text-gray-500 text-lg">
          데이터 ID: <span className="text-primary-600 font-mono font-bold">#{id}</span>의 정보를 확인하고 수정합니다.
        </p>
      </div>
      <DataForm initialData={initialData} isEdit={true} />
    </div>
  );
}
