import { create } from "zustand";
import type { UserType } from "../api/auth/types";

type AccountType = "student" | "teacher";

type AuthSessionState = {
  user: UserType | null;
  accountType: AccountType | null;

  setSession: (user: UserType, type: AccountType) => void;
  clearSession: () => void;
};

export const useAuthSessionStore = create<AuthSessionState>((set) => ({
  user: null,
  accountType: null,

  setSession: (user, type) => set({ user, accountType: type }),
  clearSession: () => set({ user: null, accountType: null }),
}));
