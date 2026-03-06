import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";
import { NewMessageEvent } from "../features/chat/chat.socket.types.ts";
import { ConversationListItemDTO, MessageDTO } from "../api/chat/chat.types.ts";
import { chatKeys } from "../features/queryKeys.ts";
import { markConversationAsRead } from "../api/chat/chai.api.ts";

export function useChatRealtime(args: {
  socket: Socket | null;
  conversationId?: string;
  myUserId?: string;
}) {
  const { socket, conversationId, myUserId } = args;
  const qc = useQueryClient();

  useEffect(() => {
    if (!socket || !conversationId) {
      return;
    }

    socket.emit("chat:join", { conversationId });

    const onNewMessage = (event: NewMessageEvent) => {
      const msg = event.message;
      if (msg.conversationId !== conversationId) {
        return;
      }

      qc.setQueryData<MessageDTO[]>(
        chatKeys.messages(conversationId),
        (old) => {
          const prev = old ?? [];
          if (prev.some((m) => m.id === msg.id)) {
            return prev;
          }
          return [...prev, msg];
        },
      );

      qc.setQueryData<ConversationListItemDTO[]>(
        chatKeys.conversations,
        (old) => {
          if (!old) {
            return old;
          }

          return old.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage: {
                    text: msg.text,
                    senderId: msg.senderId,
                    createdAt: msg.createdAt,
                  },
                  lastMessageAt: msg.createdAt,
                }
              : c,
          );
        },
      );

      if (msg.senderId !== myUserId) {
        void markConversationAsRead(conversationId);
      }
    };

    socket.on("chat:newMessage", onNewMessage);

    return () => {
      socket.emit("chat:leave", { conversationId });
      socket.off("chat:newMessage", onNewMessage);
    };
  }, [socket, conversationId, myUserId, qc]);
}
