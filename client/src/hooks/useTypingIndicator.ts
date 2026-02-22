import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { TypingEvent } from "../features/chat/chat.socket.types.ts";

export function useTypingIndicator(args: {
  socket: Socket | null;
  conversationId?: string;
  myUserId?: string;
}) {
  const { socket, conversationId, myUserId } = args;
  const [typingUserId, setTypingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!socket || !conversationId) {
      return;
    }

    const onTyping = (e: TypingEvent) => {
      if (e.conversationId !== conversationId) {
        return;
      }
      if (myUserId && e.userId === myUserId) {
        return;
      }
      setTypingUserId(e.userId);
    };

    const onTypingStop = (e: TypingEvent) => {
      if (e.conversationId !== conversationId) {
        return;
      }
      if (typingUserId === e.userId) {
        setTypingUserId(null);
      }
    };

    socket.on("chat:typing", onTyping);
    socket.on("chat:typing:stop", onTypingStop);

    return () => {
      socket.off("chat:typing", onTyping);
      socket.off("chat:typing:stop", onTypingStop);
    };
  }, [socket, conversationId, myUserId, typingUserId]);

  useEffect(() => {
    if (!typingUserId) {
      return;
    }
    const timer = window.setTimeout(() => setTypingUserId(null), 2000);
    return () => window.clearTimeout(timer);
  }, [typingUserId]);

  return { typingUserId };
}
