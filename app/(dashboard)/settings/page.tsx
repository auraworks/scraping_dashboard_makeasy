"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/hooks/useToast";

export default function SettingsPage() {
  const [isRebooting, setIsRebooting] = useState(false);
  const [lastReboot, setLastReboot] = useState<string | null>(null);
  const toast = useToast();

  const handleReboot = async () => {
    if (!confirm("EC2 인스턴스를 재부팅하시겠습니까?\n재부팅 중에는 서비스가 일시적으로 중단됩니다.")) {
      return;
    }

    setIsRebooting(true);
    try {
      const res = await fetch("/api/ec2/reboot", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        toast.success("재부팅 시작", data.message);
        setLastReboot(new Date().toLocaleString("ko-KR"));
      } else {
        toast.error("재부팅 실패", data.error || "알 수 없는 오류가 발생했습니다.");
      }
    } catch {
      toast.error("재부팅 실패", "API 호출 중 오류가 발생했습니다.");
    } finally {
      setIsRebooting(false);
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">시스템 설정</h1>

      <div className="bg-white rounded-lg border border-gray-200 w-full">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">서버 관리</h2>
        </div>

        <div className="px-5 py-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-900">EC2 인스턴스 재부팅</span>
            {lastReboot && (
              <span className="text-xs text-gray-400">마지막 재부팅: {lastReboot}</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-4">
            인스턴스 ID: <span className="font-mono">i-03b6df64b273de01b</span> · ap-northeast-2
          </p>

          <button
            onClick={handleReboot}
            disabled={isRebooting}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isRebooting
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRebooting ? "animate-spin" : ""}`} />
            {isRebooting ? "재부팅 중..." : "재부팅"}
          </button>

          <div className="mt-3 space-y-1.5">
            <p className="text-xs text-amber-600">
              재부팅 중에는 서비스가 1~2분간 중단됩니다.
            </p>
            <p className="text-xs text-gray-500">
              크롤러는 <span className="font-semibold text-gray-700">매일 오전 6시</span>에 자동으로 재부팅되어 실행됩니다.
            </p>
            <p className="text-xs text-gray-500">
              그 외 시간에 크롤링을 시작하려면 위 재부팅 버튼을 눌러 임의로 시작해 주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
