import { create } from "zustand";
import { lockScroll, unlockScroll } from "../util/modalScroll.util.ts";
import { TeacherType } from "../api/teacher/teacher.type.ts";

export type ModalName =
  | null
  | "logout"
  | "bookingConfirm"
  | "signIn"
  | "confirmDelete"
  | "alert"
  | "deleteReview"
  | "fullScreenLoader";

type ModalPayload = {
  logout?: never;
  bookingConfirm?: {
    teacher: TeacherType;
    selectedDate: Date;
    selectedTime: string;
    selectedSubject?: string;
    selectedLevel?: string;
    selectedPrice?: number;
    description?: string;
    onSuccess?: () => void;
  };
  signIn?: { returnTo?: string };
  confirmDelete?: {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: "danger" | "primary";
  };
  alert?: {
    title: string;
    message: string;
  };
  deleteReview?: {
    teacherId: string;
    reviewId: string;
  };
  fullScreenLoader?: never;
};

type ModalState = {
  activeModal: ModalName;
  opened: boolean;
  payload: ModalPayload[keyof ModalPayload] | null;

  open: <T extends Exclude<ModalName, null>>(
    name: T,
    payload?: ModalPayload[T],
  ) => void;
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
