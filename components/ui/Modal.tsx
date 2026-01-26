"use client";

import { useModalStore } from "@/components/hooks/useModal";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function ModalContainer() {
  const { modals, closeModal, updateModal } = useModalStore();

  const handleConfirm = async (
    id: string,
    onConfirm?: () => void | Promise<void>,
  ) => {
    if (onConfirm) {
      updateModal(id, { isLoading: true });
      try {
        await onConfirm();
      } finally {
        updateModal(id, { isLoading: false });
      }
    }
    closeModal(id);
  };

  const handleCancel = (id: string, onCancel?: () => void) => {
    if (onCancel) {
      onCancel();
    }
    closeModal(id);
  };

  return (
    <>
      {modals.map((modal) => (
        <div
          key={modal.id}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4 animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {modal.title}
              </h2>
              <button
                onClick={() => handleCancel(modal.id, modal.onCancel)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-gray-600 text-sm">{modal.description}</p>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 justify-end">
              <Button
                variant="outline"
                onClick={() => handleCancel(modal.id, modal.onCancel)}
                disabled={modal.isLoading}
              >
                {modal.cancelText}
              </Button>
              <Button
                onClick={() => handleConfirm(modal.id, modal.onConfirm)}
                disabled={modal.isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {modal.isLoading ? "처리 중..." : modal.confirmText}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
