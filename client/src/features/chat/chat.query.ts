import { chatKeys } from "../queryKeys.ts";
import { useQuery } from "@tanstack/react-query";
import { getConversations, getMessages } from "../../api/chat/chai.api.ts";

export function useChatConversationsQuery() {
  return useQuery({
    queryKey: chatKeys.conversations,
    queryFn: getConversations,
  });
}

export function useChatMessagesQuery(conversationId: string | undefined) {
  return useQuery({
    queryKey: chatKeys.messages(conversationId ?? ""),
    queryFn: () => getMessages(conversationId as string),
    enabled: Boolean(conversationId),
  });
}
