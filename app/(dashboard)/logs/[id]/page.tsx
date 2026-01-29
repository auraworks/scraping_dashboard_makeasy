import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { IoMenu } from "react-icons/io5";

// Mock fetching function
async function getLog(id: string) {
  const logs = [
    {
      id: "1",
      level: "INFO",
      message: "네이버 뉴스 크롤링 작업이 성공적으로 시작되었습니다.",
      module: "CrawlerService",
      timestamp: "24/01/26 10:00:01",
      user: "System",
      details: "Process started with PID 12345. Target URL: https://news.naver.com. No errors reported during initialization.",
    },
    // Fallback
    {
      id: "default",
      level: "UNKNOWN",
      message: "로그 정보를 찾을 수 없습니다.",
      module: "Unknown",
      timestamp: "-",
      user: "-",
      details: "",
    }
  ];
  return logs.find((log) => log.id === id) || logs[logs.length - 1]; // Just return something for demo
}

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "default" }];
}

interface LogDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LogDetailPage({ params }: LogDetailPageProps) {
  const { id } = await params;
  const log = await getLog(id);

  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">로그 상세 정보</h1>
        <p className="text-gray-500 text-lg">
          로그 ID: <span className="text-primary-600 font-mono font-bold">#{id}</span>의 상세 내역입니다.
        </p>
      </div>

      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 gap-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <span className="text-gray-500 font-medium">로그 레벨</span>
            <Badge
              className={`font-bold px-3 py-1 rounded-lg shadow-none border ${
                log.level === "ERROR"
                  ? "bg-primary-900 text-white border-primary-900"
                  : log.level === "WARN"
                  ? "bg-primary-100 text-primary-700 border-primary-200"
                  : log.level === "INFO"
                  ? "bg-primary-50 text-primary-600 border-primary-100"
                  : "bg-gray-50 text-gray-400 border-gray-200"
              }`}
            >
              {log.level}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="border-b border-gray-100 pb-4">
                <span className="block text-gray-500 font-medium mb-1">발생 모듈</span>
                <span className="text-gray-900 font-bold">{log.module}</span>
             </div>
             <div className="border-b border-gray-100 pb-4">
                <span className="block text-gray-500 font-medium mb-1">사용자 / 시스템</span>
                <span className="text-gray-900 font-bold">{log.user}</span>
             </div>
             <div className="border-b border-gray-100 pb-4">
                <span className="block text-gray-500 font-medium mb-1">발생 시각</span>
                <span className="text-gray-900 font-mono">{log.timestamp}</span>
             </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mt-2">
            <span className="block text-gray-500 font-bold mb-2">로그 메시지</span>
            <p className="text-gray-900 font-medium text-lg leading-relaxed">{log.message}</p>
          </div>

          {log.details && (
            <div className="bg-gray-900 rounded-xl p-6 shadow-inner text-gray-300 font-mono text-sm overflow-x-auto">
              <span className="block text-gray-500 font-bold mb-2 uppercase tracking-wider text-xs">Stack Trace / Details</span>
              <pre>{log.details}</pre>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
           <Link href="/logs">
              <Button type="button" variant="outline" className="h-14 px-8 rounded-2xl border-gray-200 text-gray-600 font-bold hover:bg-gray-50">
                <IoMenu className="mr-2 text-lg" />
                목록으로 돌아가기
              </Button>
           </Link>
        </div>
      </div>
    </div>
  );
}
