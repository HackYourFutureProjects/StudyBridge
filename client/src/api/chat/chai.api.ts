import { apiProtected } from "../api.ts";
import { ConversationListItemDTO, MessageDTO } from "./chat.types.ts";

export async function getConversations(): Promise<ConversationListItemDTO[]> {
  const { data } = await apiProtected.get("/api/chat/conversations");
  return data;
}

export async function getMessages(
  conversationId: string,
): Promise<MessageDTO[]> {
  const { data } = await apiProtected.get(
    `/api/chat/conversations/${conversationId}/messages`,
  );
  return data;
}
