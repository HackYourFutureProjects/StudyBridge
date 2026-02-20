import { Router } from "express";
import { ChatController } from "../controllers/chat.controller.js";
import { container } from "../composition/compositionRoot.js";
import { TYPES } from "../composition/composition.types.js";
import { AuthMiddleware } from "../middlewares/authMiddlewareWithBearer.js";

export const chatRouter = Router();
const chatController = container.get<ChatController>(TYPES.ChatController);
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

chatRouter.get(
  "/conversations",
  authMiddleware.handle,
  chatController.getConversations.bind(chatController),
);

chatRouter.get(
  "/conversations/:id/messages",
  authMiddleware.handle,
  chatController.getMessages.bind(chatController),
);
