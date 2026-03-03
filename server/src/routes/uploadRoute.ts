import { Router } from "express";
import { UploadController } from "../controllers/upload.controller.js";
import { uploadAvatarWithLogging } from "../middlewares/upload.middleware.js";
import { container } from "../composition/compositionRoot.js";
import { TYPES } from "../composition/composition.types.js";
import { AuthMiddleware } from "../middlewares/authMiddlewareWithBearer.js";

const router = Router();
const uploadController = new UploadController();
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

// POST /api/upload/avatar - Upload/change avatar
router.post(
  "/avatar",
  authMiddleware.handle,
  uploadAvatarWithLogging,
  (req, res) => uploadController.uploadAvatar(req, res),
);

// DELETE /api/upload/avatar - Delete avatar
router.delete("/avatar", authMiddleware.handle, (req, res) =>
  uploadController.deleteAvatar(req, res),
);

export { router as uploadRouter };
