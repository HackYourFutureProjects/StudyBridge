import { Router } from "express";
import { container } from "../composition/compositionRoot.js";
import { TYPES } from "../composition/composition.types.js";
import { ModeratorController } from "../controllers/moderator.controller.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { AuthMiddleware } from "../middlewares/authMiddlewareWithBearer.js";
import { statusValidation } from "../validation/moderator/changeStatusValidator.js";

export const moderatorRouter = Router();

const moderatorController = container.get<ModeratorController>(
  TYPES.ModeratorController,
);
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

moderatorRouter.patch(
  "/teachers/:teacherId/status",
  authMiddleware.handle,
  requireRole("moderator"),
  statusValidation(),
  moderatorController.changeTeacherStatus.bind(moderatorController),
);
