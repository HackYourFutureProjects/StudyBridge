import { create } from "zustand";

export type NotificationPerson = {
  id: string;
  name: string;
  imageUrl: string | null;
};

export type AppNotification =
  | {
      id: string;
      type: "chatMessages";
      conversationId: string;
      sender: NotificationPerson;
      message: {
        id: string;
        text: string;
        senderId: string;
        createdAt: string;
      };
      createdAt: string;
      isRead: boolean;
    }
  | {
      id: string;
      type: "appointmentStatus";
      appointmentId: string;
      status: "approved" | "rejected";
      actor: NotificationPerson;
      lesson: string;
      date: string;
      time: string;
      createdAt: string;
      isRead: boolean;
    };

export type NewAppNotification =
  | {
      type: "chatMessages";
      conversationId: string;
      sender: NotificationPerson;
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
      status: "approved" | "rejected";
      actor: NotificationPerson;
      lesson: string;
      date: string;
      time: string;
    };

type NotificationFeedState = {
  items: AppNotification[];
  addNotification: (notification: NewAppNotification) => void;
  markAllAsRead: () => void;
};

export const useNotificationFeedStore = create<NotificationFeedState>(
  (set) => ({
    items: [],

    addNotification: (notification) =>
      set((state) => ({
        items: [
          {
            ...notification,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            isRead: false,
          } as AppNotification,
          ...state.items,
        ],
      })),

    markAllAsRead: () =>
      set((state) => ({
        items: state.items.map((item) => ({ ...item, isRead: true })),
      })),
  }),
);
