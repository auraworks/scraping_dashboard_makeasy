"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoMenu } from "react-icons/io5";
import { CheckCircle2, XCircle, Clock, Globe, Loader2 } from "lucide-react";
import { useLogDetail } from "@/components/hooks";

export default function LogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: log, isLoading, error } = useLogDetail(id);

  if (isLoading) {
    return (
      <div className="p-8 w-full flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-4" />
        <p className="text-gray-400 font-medium">로그 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !log) {
    return (
      <div className="p-8 w-full flex flex-col items-center justify-center min-h-[400px]">
        <XCircle className="w-12 h-12 text-rose-500 mb-4" />
        <p className="text-gray-500 mb-4 font-medium">존재하지 않거나 불러올 수 없는 로그입니다.</p>
        <Button onClick={() => router.push("/logs")} className="rounded-xl">목록으로 돌아가기</Button>
      </div>
    );
  }

  const level = log.level?.toLowerCase() || "";
  const isSuccess = level !== "error" && level !== "failure";
  const sourceName = log.sources?.name || `#${log.source_id ?? "-"}`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  // Convert details JSON to formatted string if it exists
  const detailsString = log.details ? JSON.stringify(log.details, null, 2) : "-";

  // Choose what to show in "상세 에러 로그"
  // If FAIL, show message. If message looks like a JSON string, try to parse it.
  let displayError = log.message || "-";
  if (!isSuccess && log.message) {
    try {
      // If it's a stringified JSON (common in these logs), make it pretty
      if (log.message.includes("{") && log.message.includes("}")) {
        const potentialJson = log.message.substring(log.message.indexOf("{"));
        const parsed = JSON.parse(potentialJson.replace(/'/g, '"'));
        displayError = `${log.message.split("{")[0]}\n${JSON.stringify(parsed, null, 2)}`;
      }
    } catch (e) {
      // If parsing fails, just use the original message
    }
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
                  className={`font-bold px-4 py-2 rounded-xl shadow-none border flex items-center gap-2 text-base ${isSuccess
                    ? "bg-primary-50 text-primary-600 border-primary-100"
                    : "bg-primary-900 text-white border-primary-900"
                    }`}
                >
                  {isSuccess ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  {isSuccess ? "SUCCESS" : "FAIL"}
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
                value={sourceName}
                className="h-14 w-full rounded-xl bg-gray-50 border-none text-base font-bold px-5"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-bold text-gray-800 ml-1">수집 시간</Label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  readOnly
                  value={formatDate(log.created_at)}
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
                value={log.url || "-"}
                className="h-14 w-full rounded-xl bg-gray-50 border-none text-base font-mono px-12 truncate"
              />
            </div>
          </div>

          {/* 요약 메시지 */}
          <div className="space-y-2">
            <Label className="text-base font-bold text-gray-800 ml-1">요약 메시지</Label>
            <Input
              readOnly
              value={log.message || "-"}
              className="h-14 w-full rounded-xl bg-gray-50 border-none text-base font-medium px-5"
            />
          </div>

          {/* 상세 로그 (details JSON) */}
          <div className="space-y-2">
            <Label className="text-base font-bold text-gray-800 ml-1">상세 데이터 (Details)</Label>
            <Textarea
              readOnly
              value={detailsString}
              className="min-h-[150px] rounded-2xl bg-gray-50 text-gray-600 font-mono text-xs p-6 leading-relaxed border-none focus-visible:ring-0"
            />
          </div>

          {/* 상세 에러 로그 */}
          {!isSuccess && (
            <div className="space-y-2">
              <Label className="text-base font-bold text-gray-800 ml-1">상세 에러 로그</Label>
              <Textarea
                readOnly
                value={displayError}
                className={`min-h-[250px] rounded-2xl bg-gray-900 text-gray-300 font-mono text-xs p-6 leading-relaxed border-none focus-visible:ring-0 border-l-4 border-l-rose-500`}
              />
            </div>
          )}
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
