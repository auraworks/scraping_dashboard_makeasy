import React from "react";
import { SourceForm } from "@/components/sources/SourceForm";

// Mock fetching function (In reality, this would use the project_id from params)
async function getSourceData(id: string) {
  // Demo mock data
  return {
    name: "네이버 뉴스",
    url: "https://news.naver.com",
    type: "뉴스",
    cycle: "1시간",
    status: "수집중",
    description: "네이버 뉴스 헤드라인 및 주요 기사 수집용 소스입니다.",
    selector_config: JSON.stringify({
      title: ".media_end_head_headline",
      content: "#newsct_article",
      author: ".byline_p",
      date: ".media_end_head_info_dateline_registration"
    }, null, 2)
  };
}

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }];
}

interface EditSourcePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSourcePage({ params }: EditSourcePageProps) {
  const { id } = await params;
  const initialData = await getSourceData(id);

  return (
    <div className="p-8 w-full ">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">소스 정보 수정</h1>
        <p className="text-gray-500 text-lg">
          소스 ID: <span className="text-primary-600 font-mono font-bold">#{id}</span>의 정보를 수정합니다.
        </p>
      </div>
      <SourceForm initialData={initialData} isEdit={true} />
    </div>
  );
}
