import { create } from "zustand";

interface ModalConfig {
  id: string;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

interface ModalStore {
  modals: ModalConfig[];
  openModal: (config: Omit<ModalConfig, "id">) => string;
  closeModal: (id: string) => void;
  updateModal: (id: string, config: Partial<ModalConfig>) => void;
  clearModals: () => void;
}

const useModalStore = create<ModalStore>((set) => ({
  modals: [],
  openModal: (config) => {
    const id = Date.now().toString();
    set((state) => ({
      modals: [
        ...state.modals,
        {
          id,
          confirmText: "확인",
          cancelText: "취소",
          isLoading: false,
          ...config,
        },
      ],
    }));
    return id;
  },
  closeModal: (id) =>
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id),
    })),
  updateModal: (id, config) =>
    set((state) => ({
      modals: state.modals.map((modal) =>
        modal.id === id ? { ...modal, ...config } : modal,
      ),
    })),
  clearModals: () => set({ modals: [] }),
}));

export const useModal = () => {
  const { openModal, closeModal, updateModal } = useModalStore();

  return {
    open: (config: Omit<ModalConfig, "id">) => openModal(config),
    close: (id: string) => closeModal(id),
    update: (id: string, config: Partial<ModalConfig>) =>
      updateModal(id, config),
  };
};

export { useModalStore };
