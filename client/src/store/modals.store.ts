import { create } from "zustand";
import { lockScroll, unlockScroll } from "../util/modalScroll.util.ts";

export type ModalName = null | "signup";

type ModalState = {
  activeModal: ModalName;
  opened: boolean;
  payload: string | null;

  open: (name: Exclude<ModalName, null>, payload?: string) => void;
  close: () => void;
  finishClose: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  opened: false,
  payload: null,

  open: (name, payload) => {
    lockScroll();
    set({ activeModal: name, payload: payload ?? null, opened: false });
    requestAnimationFrame(() => set({ opened: true }));
  },

  close: () => {
    set({ opened: false });
  },

  finishClose: () => {
    unlockScroll();
    set({ activeModal: null, payload: null });
  },
}));
