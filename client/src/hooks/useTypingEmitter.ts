import { useRef, useCallback } from "react";
import type { Socket } from "socket.io-client";

export function useTypingEmitter(args: {
  socket: Socket | null;
  conversationId?: string;
  idleMs?: number;
}) {
  const { socket, conversationId, idleMs = 900 } = args;

  const typingTimeoutRef = useRef<number | null>(null);
  const typingActiveRef = useRef(false);

  const emitTyping = useCallback(() => {
    if (!socket || !conversationId) {
      return;
    }

    if (!typingActiveRef.current) {
      typingActiveRef.current = true;
      socket.emit("chat:typing:start", { conversationId });
    }

    if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      typingActiveRef.current = false;
      socket.emit("chat:typing:stop", { conversationId });
    }, idleMs);
  }, [socket, conversationId, idleMs]);

  const stopTypingNow = useCallback(() => {
    if (!socket || !conversationId) {
      return;
    }
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = null;
    if (typingActiveRef.current) {
      typingActiveRef.current = false;
      socket.emit("chat:typing:stop", { conversationId });
    }
  }, [socket, conversationId]);

  return { emitTyping, stopTypingNow };
}
