import { Router } from "express";
import { container } from "../composition/compositionRoot.js";
import { TYPES } from "../composition/composition.types.js";
import { AuthMiddleware } from "../middlewares/authMiddlewareWithBearer.js";
import { NotificationController } from "../controllers/notification.controller.js";

export const notificationsRouter = Router();

const notificationsController = container.get<NotificationController>(
  TYPES.NotificationController,
);
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

notificationsRouter.get(
  "/",
  authMiddleware.handle,
  notificationsController.getMyNotifications.bind(notificationsController),
);
notificationsRouter.patch(
  "/read-all",
  authMiddleware.handle,
  notificationsController.markAllAsRead.bind(notificationsController),
);

notificationsRouter.delete(
  "/read-all",
  authMiddleware.handle,
  notificationsController.deleteAllRead.bind(notificationsController),
);

notificationsRouter.patch(
  "/:id/read",
  authMiddleware.handle,
  notificationsController.markOneAsRead.bind(notificationsController),
);
