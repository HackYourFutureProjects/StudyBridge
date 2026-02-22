import type { MessageDTO } from "../../api/chat/chat.types";

export type JoinPayload = { conversationId: string };
export type LeavePayload = { conversationId: string };

export type TypingStartPayload = { conversationId: string };
export type TypingStopPayload = { conversationId: string };

export type TypingEvent = {
  conversationId: string;
  userId: string;
  role: "student" | "teacher";
};

export type SendMessagePayload = { conversationId: string; text: string };

export type SendAck =
  | { ok: true; message: MessageDTO }
  | { ok: false; error: string };

export type NewMessageEvent = { message: MessageDTO };
