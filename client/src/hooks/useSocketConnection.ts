import { useEffect } from "react";
import { useAuthSessionStore } from "../store/authSession.store.ts";
import { useSocketStore } from "../store/socket.store.ts";

export const useSocketConnection = () => {
  const accessToken = useAuthSessionStore((s) => s.accessToken);
  const socket = useSocketStore((s) => s.socket);
  const connect = useSocketStore((s) => s.connect);
  const disconnect = useSocketStore((s) => s.disconnect);

  useEffect(() => {
    if (!accessToken) {
      disconnect();
      return;
    }

    if (!socket) {
      connect(accessToken);
    }
  }, [accessToken, socket, connect, disconnect]);
};
