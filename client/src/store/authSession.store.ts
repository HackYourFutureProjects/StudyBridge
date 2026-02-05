import { create } from "zustand";
import type { UserType } from "../api/auth/types";

type AccountType = "student" | "teacher";

type AuthSessionState = {
  user: UserType | null;
  accountType: AccountType | null;
  accessToken: string | null;

  setAccessToken: (accessToken: string | null) => void;
  setSession: (user: UserType, type: AccountType) => void;
  clearSession: () => void;
};

export const useAuthSessionStore = create<AuthSessionState>((set) => ({
  user: null,
  accountType: null,
  accessToken: null,

  setAccessToken: (accessToken) => set({ accessToken }),
  setSession: (user, type) => set({ user, accountType: type }),
  clearSession: () => set({ user: null, accountType: null, accessToken: null }),
}));
