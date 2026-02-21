import { Router } from "express";
import { container } from "../composition/compositionRoot.js";
import { TYPES } from "../composition/composition.types.js";
import { AuthMiddleware } from "../middlewares/authMiddlewareWithBearer.js";
import { StreamController } from "../controllers/stream.controller.js";

export const streamRouter = Router();

const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
const streamController = container.get<StreamController>(
  TYPES.StreamController,
);

streamRouter.get(
  "/token",
  authMiddleware.handle,
  streamController.getToken.bind(streamController),
);
