export type JoinPayload = { conversationId: string };
export type LeavePayload = { conversationId: string };
export type SendMessagePayload = { conversationId: string; text: string };

export type ChatMessageDTO = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
};

export type NewMessageEvent = { message: ChatMessageDTO };

export type SendAck =
  | { ok: true; message: ChatMessageDTO }
  | { ok: false; error: string };

export type PresenceSyncEvent = { userIds: string[] };
export type PresenceOnlineEvent = { userId: string };
export type PresenceOfflineEvent = { userId: string };
