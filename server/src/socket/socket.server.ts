import type http from "http";
import { Server, Socket } from "socket.io";

import { container } from "../composition/compositionRoot.js";
import { TYPES } from "../composition/composition.types.js";
import type { JwtService } from "../services/jwt/jwt.service.js";

import type {
  JoinPayload,
  LeavePayload,
  SendMessagePayload,
  SendAck,
  NewMessageEvent,
} from "./chat.socket.types.js";
import { errorToMessage } from "../utils/errorToMessage.js";
import { ChatService } from "../services/chat/chat.service.js";
import { validateChatText } from "./validators/chatText.validator.js";
import { validateConversationId } from "./validators/conversationId.validator.js";

type SocketData = {
  userId: string;
  role: "student" | "teacher";
};

export let io: Server | null = null;
const onlineCount = new Map<string, number>();

function markOnline(userId: string) {
  const prev = onlineCount.get(userId) ?? 0;
  onlineCount.set(userId, prev + 1);
  return prev === 0;
}

function markOffline(userId: string) {
  const prev = onlineCount.get(userId) ?? 0;
  const next = Math.max(0, prev - 1);

  if (next === 0) {
    onlineCount.delete(userId);
    return true;
  }

  onlineCount.set(userId, next);
  return false;
}
export function initSocketServer(httpServer: http.Server): Server {
  const _io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true,
    },
    transports: ["websocket"],
  });

  _io.use((socket: Socket, next) => {
    try {
      const jwtService = container.get<JwtService>(TYPES.JwtService);

      const token = socket.handshake.auth?.token as string | undefined;
      if (!token) {
        return next(new Error("No token provided"));
      }

      const payload = jwtService.verifyAccessToken(token) as {
        userId: string;
        role: "student" | "teacher";
      };

      (socket.data as SocketData).userId = payload.userId;
      (socket.data as SocketData).role = payload.role;

      return next();
    } catch {
      return next(new Error("Bad token"));
    }
  });

  _io.on("connection", (socket: Socket) => {
    const { userId } = socket.data as SocketData;

    //add socket.join(user:{id}) on connection to enable targeted incoming-call events
    socket.join(`user:${userId}`);

    const becameOnline = markOnline(userId);
    if (becameOnline) {
      _io.emit("presence:online", { userId });
    }

    socket.emit("presence:sync", { userIds: Array.from(onlineCount.keys()) });

    socket.on("disconnect", () => {
      const becameOffline = markOffline(userId);
      if (becameOffline) {
        _io.emit("presence:offline", { userId });
      }
    });

    registerChatHandlers(_io, socket);
  });

  io = _io;
  return _io;
}

function registerChatHandlers(_io: Server, socket: Socket) {
  const chatService = container.get<ChatService>(TYPES.ChatService);

  socket.on("chat:join", async ({ conversationId }: JoinPayload) => {
    const { userId } = socket.data as SocketData;
    const idCheck = validateConversationId(conversationId);
    if (!idCheck.ok) {
      return;
    }
    const can = await chatService.canAccessConversation(userId, conversationId);
    if (!can) {
      socket.emit("chat:error", { message: "Access denied" });
      return;
    }

    socket.join(conversationId);
  });

  socket.on("chat:leave", ({ conversationId }: LeavePayload) => {
    socket.leave(conversationId);
  });

  socket.on(
    "chat:typing:start",
    async ({ conversationId }: { conversationId: string }) => {
      const { userId, role } = socket.data as SocketData;
      const idCheck = validateConversationId(conversationId);
      if (!idCheck.ok) {
        return;
      }
      const can = await chatService.canAccessConversation(
        userId,
        conversationId,
      );
      if (!can) {
        return;
      }

      socket.to(conversationId).emit("chat:typing", {
        conversationId,
        userId,
        role,
      });
    },
  );

  socket.on(
    "chat:typing:stop",
    async ({ conversationId }: { conversationId: string }) => {
      const { userId, role } = socket.data as SocketData;
      const idCheck = validateConversationId(conversationId);
      if (!idCheck.ok) {
        return;
      }
      const can = await chatService.canAccessConversation(
        userId,
        conversationId,
      );
      if (!can) {
        return;
      }

      socket.to(conversationId).emit("chat:typing:stop", {
        conversationId,
        userId,
        role,
      });
    },
  );

  socket.on(
    "chat:sendMessage",
    async (payload: SendMessagePayload, cb?: (ack: SendAck) => void) => {
      const validation = validateChatText(payload?.text, { maxLen: 1000 });
      if (!validation.ok) {
        cb?.({ ok: false, error: validation.error });
        return;
      }
      try {
        const { userId } = socket.data as SocketData;

        const message = await chatService.sendMessage({
          conversationId: payload.conversationId,
          senderId: userId,
          text: payload.text,
        });

        const event: NewMessageEvent = { message };
        _io.to(payload.conversationId).emit("chat:newMessage", event);

        cb?.({ ok: true, message });
      } catch (e: unknown) {
        cb?.({ ok: false, error: errorToMessage(e) });
      }
    },
  );
}
