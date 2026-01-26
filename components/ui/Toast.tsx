"use client";

import { useToastStore, type ToastType } from "@/components/hooks/useToast";
import { FaCheckCircle } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import { X } from "lucide-react";

const toastStyles: Record<ToastType, { bg: string; border: string }> = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
};

const toastTextColor: Record<ToastType, string> = {
  success: "text-green-700",
  error: "text-red-700",
  info: "text-blue-700",
  warning: "text-yellow-700",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type];
        const textColor = toastTextColor[toast.type];
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            className={`${style.bg} border ${style.border} rounded-lg p-4 shadow-lg animate-in slide-in-from-top-2 fade-in`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {isSuccess && (
                  <FaCheckCircle className={`w-5 h-5 ${textColor}`} />
                )}
                {isError && (
                  <IoCloseCircleSharp className={`w-5 h-5 ${textColor}`} />
                )}
                {!isSuccess && !isError && (
                  <span className={`text-lg font-bold ${textColor}`}>ℹ</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`${textColor} text-sm font-medium`}>
                  {toast.title} {toast.message && `- ${toast.message}`}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
