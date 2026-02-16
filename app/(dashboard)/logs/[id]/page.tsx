"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoMenu } from "react-icons/io5";
import { CheckCircle2, XCircle, Clock, Globe, Database } from "lucide-react";

export default function LogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // Mock Data (matches the one in logs/page.tsx)
  const logs = [
    {
      id: 1,
      sourceName: "네이버 뉴스",
      url: "https://news.naver.com",
      timestamp: "2024/01/26 10:00:01",
      result: "SUCCESS",
      details: "총 15건 데이터 수집 완료",
      errorLog: "-",
    },
    {
      id: 2,
      sourceName: "인스타그램",
      url: "https://instagram.com/explore/tags/trend",
      timestamp: "2024/01/26 10:05:42",
      result: "SUCCESS",
      details: "총 42건 데이터 수집 완료",
      errorLog: "-",
    },
    {
      id: 3,
      sourceName: "다음 뉴스",
      url: "https://news.daum.net",
      timestamp: "2024/01/26 10:10:15",
      result: "FAILURE",
      details: "수집 실패",
      errorLog: "TimeoutError: Page load exceeded 30s\n  at navigate (puppeteer/lib/FrameManager.js:120:13)\n  at processTicksAndRejections (internal/process/task_queues.js:95:5)\n  -- ASYNC --\n  at Frame.<anonymous> (puppeteer/lib/helper.js:111:15)\n  at Page.goto (puppeteer/lib/Page.js:629:49)",
    },
    {
      id: 4,
      sourceName: "테크미디어",
      url: "https://techmedia.jp/news",
      timestamp: "2024/01/26 10:15:00",
      result: "SUCCESS",
      details: "총 8건 데이터 수집 완료",
      errorLog: "-",
    },
    {
      id: 5,
      sourceName: "Reddit",
      url: "https://reddit.com/r/technology",
      timestamp: "2024/01/26 10:20:22",
      result: "SUCCESS",
      details: "총 25건 데이터 수집 완료",
      errorLog: "-",
    },
    {
      id: 6,
      sourceName: "필리핀 커뮤니티",
      url: "https://philippine-forum.com",
      timestamp: "2024/01/26 10:25:11",
      result: "FAILURE",
      details: "수집 실패",
      errorLog: "ProxyError: Could not connect to Manila relay node\n  at ProxyManager.getConnection (services/ProxyManager.ts:45:11)\n  at Crawler.fetch (services/Crawler.ts:88:32)\n  at async Crawler.run (services/Crawler.ts:120:5)",
    },
  ];

  const log = logs.find((l) => l.id.toString() === id);

  if (!log) {
    return (
      <div className="p-8 w-full flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-500 mb-4">존재하지 않는 로그입니다.</p>
        <Button onClick={() => router.push("/logs")}>목록으로 돌아가기</Button>
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">로그 상세 정보</h1>
        <p className="text-gray-500 text-lg">
          로그 ID: <span className="text-primary-600 font-mono font-bold">#{id}</span>의 수집 기록을 확인합니다.
        </p>
      </div>

      {/* 메인 정보 카드 */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-8">
        <div className="grid grid-cols-1 gap-y-8">
          {/* ID & 결과 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="text-base font-bold text-gray-400 ml-1">로그 ID</Label>
              <Input
                disabled
                value={`#${id}`}
                className="h-14 w-full rounded-xl bg-gray-100 border-none text-lg font-mono font-bold text-gray-500 cursor-not-allowed opacity-100 px-5"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-bold text-gray-400 ml-1">수집 결과</Label>
              <div className="h-14 flex items-center px-1">
                <Badge
                  className={`font-bold px-4 py-2 rounded-xl shadow-none border flex items-center gap-2 text-base ${log.result === "SUCCESS"
                      ? "bg-primary-50 text-primary-600 border-primary-100"
                      : "bg-primary-900 text-white border-primary-900"
                    }`}
                >
                  {log.result === "SUCCESS" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  {log.result === "SUCCESS" ? "SUCCESS" : "FAIL"}
                </Badge>
              </div>
            </div>
          </div>

          {/* 정보원명 & 수집 시간 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="text-base font-bold text-gray-800 ml-1">정보원명</Label>
              <Input
                readOnly
                value={log.sourceName}
                className="h-14 w-full rounded-xl bg-gray-50 border-none text-base font-bold px-5"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-bold text-gray-800 ml-1">수집 시간</Label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  readOnly
                  value={log.timestamp}
                  className="h-14 w-full rounded-xl bg-gray-50 border-none text-base font-mono px-12"
                />
              </div>
            </div>
          </div>

          {/* 대상 URL */}
          <div className="space-y-2">
            <Label className="text-base font-bold text-gray-800 ml-1">대상 URL</Label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                readOnly
                value={log.url}
                className="h-14 w-full rounded-xl bg-gray-50 border-none text-base font-mono px-12 truncate"
              />
            </div>
          </div>

          {/* 요약 메시지 */}
          <div className="space-y-2">
            <Label className="text-base font-bold text-gray-800 ml-1">요약 메시지</Label>
            <Input
              readOnly
              value={log.details}
              className="h-14 w-full rounded-xl bg-gray-50 border-none text-base font-medium px-5"
            />
          </div>

          {/* 상세 에러 로그 */}
          <div className="space-y-2">
            <Label className="text-base font-bold text-gray-800 ml-1">상세 에러 로그</Label>
            <Textarea
              readOnly
              value={log.errorLog}
              className={`min-h-[250px] rounded-2xl bg-gray-900 text-gray-300 font-mono text-xs p-6 leading-relaxed border-none focus-visible:ring-0 ${log.result === "FAILURE" ? "border-l-4 border-l-rose-500" : ""
                }`}
            />
          </div>
        </div>
      </div>

      {/* 하단 버튼 섹션 */}
      <div className="flex items-center justify-between pt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/logs")}
          className="h-14 w-36 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50 transition-all text-base shadow-sm"
        >
          <IoMenu className="text-lg mr-2" />
          목록으로
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="h-14 w-28 rounded-xl border-none bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-all text-base"
          >
            뒤로가기
          </Button>
        </div>
      </div>
    </div>
  );
}
