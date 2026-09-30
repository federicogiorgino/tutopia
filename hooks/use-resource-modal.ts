import {
  type ResourceModalView,
  useResourceModalStore,
} from "@/store/resource-modal";

export const useResourceModalIsOpen = () =>
  useResourceModalStore((s) => s.isOpen);
export const useResourceModalView = () => useResourceModalStore((s) => s.view);

export const useResourceModalActions = () =>
  useResourceModalStore((s) => s.actions);

export const openResourceModal = (view?: ResourceModalView) =>
  useResourceModalStore.getState().actions.open(view);
