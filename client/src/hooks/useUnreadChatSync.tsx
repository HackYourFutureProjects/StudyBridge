import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketStore } from "../store/socket.store.ts";
import { chatKeys } from "../features/queryKeys.ts";
import { ConversationListItemDTO } from "../api/chat/chat.types.ts";

type UnreadUpdatedPayload = {
  conversationId: string;
  unreadCount: {
    student: number;
    teacher: number;
  };
};

export const useUnreadChatSync = () => {
  const socket = useSocketStore((s) => s.socket);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    const onUnreadUpdated = (payload: UnreadUpdatedPayload) => {
      queryClient.setQueryData<ConversationListItemDTO[]>(
        chatKeys.conversations,
        (old) => {
          if (!old) {
            return old;
          }

          return old.map((conversation) =>
            conversation.id === payload.conversationId
              ? {
                  ...conversation,
                  unreadCount: payload.unreadCount,
                }
              : conversation,
          );
        },
      );
    };

    socket.on("chat:unreadUpdated", onUnreadUpdated);

    return () => {
      socket.off("chat:unreadUpdated", onUnreadUpdated);
    };
  }, [socket, queryClient]);
};
