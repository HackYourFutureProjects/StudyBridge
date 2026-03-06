import { create } from "zustand";

type UnreadCount = {
  student: number;
  teacher: number;
};

type ConversationItem = {
  id: string;
  peer: {
    id: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string | null;
  };
  unreadCount: UnreadCount;
  lastMessage?: {
    text: string;
    senderId: string;
    createdAt: string;
  };
  updatedAt?: string;
  lastMessageAt?: string;
};

type ChatListState = {
  conversations: ConversationItem[];
  setConversations: (items: ConversationItem[]) => void;
  updateUnread: (args: {
    conversationId: string;
    unreadCount: UnreadCount;
  }) => void;
};

export const useChatListStore = create<ChatListState>((set) => ({
  conversations: [],
  setConversations: (items) => set({ conversations: items }),
  updateUnread: ({ conversationId, unreadCount }) =>
    set((state) => ({
      conversations: state.conversations.map((item) =>
        item.id === conversationId ? { ...item, unreadCount } : item,
      ),
    })),
}));
