import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (type: ToastType, title: string, message: string) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (type, title, message) => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { id, type, title, message }],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, 3000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}));

export const useToast = () => {
  const { addToast } = useToastStore();

  return {
    success: (title: string, message: string) =>
      addToast("success", title, message),
    error: (title: string, message: string) =>
      addToast("error", title, message),
    info: (title: string, message: string) => addToast("info", title, message),
    warning: (title: string, message: string) =>
      addToast("warning", title, message),
  };
};

export { useToastStore };
