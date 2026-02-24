import { useCallback } from "react";
import type { Socket } from "socket.io-client";
import { SendAck } from "../features/chat/chat.socket.types.ts";
import { useNotificationStore } from "../store/notification.store.ts";

export function useSendChatMessage(args: {
  socket: Socket | null;
  conversationId?: string;
  stopTypingNow: () => void;
  onSuccess?: () => void;
}) {
  const { socket, conversationId, stopTypingNow, onSuccess } = args;
  const notifyError = useNotificationStore((s) => s.error);

  return useCallback(
    (text: string) => {
      if (!socket || !conversationId) {
        return;
      }

      const t = text.trim();
      if (!t) {
        return;
      }

      stopTypingNow();

      socket.emit(
        "chat:sendMessage",
        { conversationId, text: t },
        (ack: SendAck) => {
          if (!ack?.ok) {
            notifyError(ack.error);
            return;
          }
          onSuccess?.();
        },
      );
    },
    [socket, conversationId, stopTypingNow, onSuccess, notifyError],
  );
}
