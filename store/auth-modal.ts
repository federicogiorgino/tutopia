import { create } from "zustand";

export type AuthView = "login" | "register";

interface AuthModalState {
  isOpen: boolean;
  view: AuthView;
  actions: {
    open: (view?: AuthView) => void;
    close: () => void;
    setView: (view: AuthView) => void;
    toggleView: () => void;
  };
}

// Not exported
export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  view: "login",
  actions: {
    open: (view = "login") => set({ isOpen: true, view }),
    close: () => set({ isOpen: false }),
    setView: (view) => set({ view }),
    toggleView: () =>
      set((s) => ({ view: s.view === "login" ? "register" : "login" })),
  },
}));
