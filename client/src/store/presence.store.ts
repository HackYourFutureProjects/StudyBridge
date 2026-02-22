import { create } from "zustand";

type PresenceState = {
  onlineIds: Set<string>;
  setOnlineIds: (ids: string[]) => void;
  markOnline: (id: string) => void;
  markOffline: (id: string) => void;
  isOnline: (id?: string | null) => boolean;
};

export const usePresenceStore = create<PresenceState>((set, get) => ({
  onlineIds: new Set<string>(),

  setOnlineIds: (ids) => set({ onlineIds: new Set(ids) }),

  markOnline: (id) =>
    set((s) => {
      const next = new Set(s.onlineIds);
      next.add(id);
      return { onlineIds: next };
    }),

  markOffline: (id) =>
    set((s) => {
      const next = new Set(s.onlineIds);
      next.delete(id);
      return { onlineIds: next };
    }),

  isOnline: (id) => (id ? get().onlineIds.has(id) : false),
}));
