import type http from "http";
import { Server, type Socket } from "socket.io";

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
