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

type NotificationFeedState = {
  items: AppNotification[];
  setItems: (items: AppNotification[]) => void;
  addNotification: (notification: AppNotification) => void;
  markAllAsReadLocal: () => void;
};

export const useNotificationFeedStore = create<NotificationFeedState>(
  (set) => ({
    items: [],

    setItems: (items) =>
      set({
        items,
      }),

    addNotification: (notification) =>
      set((state) => ({
        items: [notification, ...state.items],
      })),

    markAllAsReadLocal: () =>
      set((state) => ({
        items: state.items.map((item) => ({ ...item, isRead: true })),
      })),
  }),
);
