import { create } from "zustand";
import { io, Socket } from "socket.io-client";

type SocketState = {
  socket: Socket | null;
  isConnected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
};

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,

  connect: (token) => {
    const existing = get().socket;
    if (existing && !existing.disconnected) {
      return;
    }
    existing?.removeAllListeners();
    existing?.disconnect();

    const s = io("/", {
      transports: ["websocket"],
      withCredentials: true,
      auth: { token },
    });

    s.on("connect", () => set({ isConnected: true }));
    s.on("disconnect", () => set({ isConnected: false }));

    set({ socket: s });
  },

  disconnect: () => {
    get().socket?.disconnect();
    set({ socket: null, isConnected: false });
  },
}));
