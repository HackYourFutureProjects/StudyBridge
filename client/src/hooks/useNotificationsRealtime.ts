import { useEffect } from "react";
import { useSocketStore } from "../store/socket.store.ts";
import {
  AppNotification,
  useNotificationFeedStore,
} from "../store/notificationFeed.store.ts";

export const useNotificationsRealtime = () => {
  const socket = useSocketStore((s) => s.socket);
  const addNotification = useNotificationFeedStore((s) => s.addNotification);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const onNewNotification = (payload: AppNotification) => {
      addNotification(payload);
    };

    socket.on("notification:new", onNewNotification);

    return () => {
      socket.off("notification:new", onNewNotification);
    };
  }, [socket, addNotification]);
};
