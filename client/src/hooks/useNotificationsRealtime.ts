import { useEffect } from "react";
import { useSocketStore } from "../store/socket.store.ts";
import { useNotificationFeedStore } from "../store/notificationFeed.store.ts";
import { AppointmentStatus } from "../types/appointments.types.ts";

type AppNotification =
  | {
      type: "chatMessages";
      conversationId: string;
      message: {
        id: string;
        text: string;
        senderId: string;
        createdAt: string;
      };
    }
  | {
      type: "appointmentStatus";
      appointmentId: string;
      status: AppointmentStatus;
      teacherId: string;
      lesson: string;
      date: string;
      time: string;
    };

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
