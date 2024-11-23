import { create } from "zustand";

type PopupStore = {
  visible: boolean;
  setVisible: (visible: boolean) => void;

  children: React.ReactNode;
  setChildren: (children: React.ReactNode) => void;
};

export const usePopupContext = create<PopupStore>((set) => ({
  visible: false,
  setVisible: (visible) => set({ visible }),

  children: <></>,
  setChildren: (children) => set({ children }),
}));
