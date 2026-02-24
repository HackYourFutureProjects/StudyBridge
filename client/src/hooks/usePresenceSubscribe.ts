import { useEffect } from "react";
import { useSocketStore } from "../store/socket.store";
import { usePresenceStore } from "../store/presence.store";

export function usePresenceSubscribe() {
  const socket = useSocketStore((s) => s.socket);
  const setOnlineIds = usePresenceStore((s) => s.setOnlineIds);
  const markOnline = usePresenceStore((s) => s.markOnline);
  const markOffline = usePresenceStore((s) => s.markOffline);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const onSync = (e: { userIds: string[] }) => setOnlineIds(e.userIds);
    const onOnline = (e: { userId: string }) => markOnline(e.userId);
    const onOffline = (e: { userId: string }) => markOffline(e.userId);

    socket.on("presence:sync", onSync);
    socket.on("presence:online", onOnline);
    socket.on("presence:offline", onOffline);

    return () => {
      socket.off("presence:sync", onSync);
      socket.off("presence:online", onOnline);
      socket.off("presence:offline", onOffline);
    };
  }, [socket, setOnlineIds, markOnline, markOffline]);
}
