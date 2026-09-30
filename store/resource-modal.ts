import { create } from "zustand";

export type ResourceModalView = "select" | "snippet" | "post" | "skill";

interface ResourceModalState {
  isOpen: boolean;
  view: ResourceModalView;
  actions: {
    open: (view?: ResourceModalView) => void;
    close: () => void;
    setView: (view: ResourceModalView) => void;
  };
}

export const useResourceModalStore = create<ResourceModalState>((set) => ({
  isOpen: false,
  view: "select",
  actions: {
    open: (view = "select") => set({ isOpen: true, view }),
    close: () => set({ isOpen: false }),
    setView: (view) => set({ view }),
  },
}));
