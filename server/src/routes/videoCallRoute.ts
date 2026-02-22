import { Router } from "express";
import { container } from "../composition/compositionRoot.js";
import { TYPES } from "../composition/composition.types.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { VideoCallController } from "../controllers/videoCall.controller.js";
import { startCallValidationMiddleware } from "../validation/videoCall/videoCallValidationMiddelware.js";
import { AuthMiddleware } from "../middlewares/authMiddlewareWithBearer.js";

export const videoCallRouter = Router();

const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
const videoCallController = container.get<VideoCallController>(
  TYPES.VideoCallController,
);

videoCallRouter.post(
  "/start",
  authMiddleware.handle,
  startCallValidationMiddleware(),
  errorMiddleware,
  videoCallController.startVideoCallController.bind(videoCallController),
);
