import { type AuthView, useAuthModalStore } from "@/store/auth-modal";

// Exported custom hooks: one selector each
export const useAuthModalIsOpen = () => useAuthModalStore((s) => s.isOpen);
export const useAuthModalView = () => useAuthModalStore((s) => s.view);

// Actions live in a stable object, so this never causes re-renders
export const useAuthModalActions = () => useAuthModalStore((s) => s.actions);

// Non-React access (e.g. axios interceptor) without exposing the store
export const openAuthModal = (view?: AuthView) =>
  useAuthModalStore.getState().actions.open(view);
