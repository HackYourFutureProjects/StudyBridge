export type ConversationListItemDB = {
  id: string;
  participantIds: [string, string];
  appointmentStatus: "approved" | "pending" | "rejected";
  lastMessage?: { text: string; senderId: string; createdAt: string };
  updatedAt: string;
  lastMessageAt?: string;
  unreadCount: {
    student: number;
    teacher: number;
  };
};

export type MessageDB = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
};
