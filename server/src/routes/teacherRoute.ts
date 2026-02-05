import { Router } from "express";
import { container } from "../composition/compositionRoot.js";
import { TYPES } from "../composition/composition.types.js";
import { TeacherController } from "../controllers/teacher.controller.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { requireSelf } from "../middlewares/requireSelf.middleware.js";
import { AuthMiddleware } from "../middlewares/authMiddlewareWithBearer.js";

export const teacherRouter = Router();
const teacherController = container.get<TeacherController>(
  TYPES.TeacherController,
);
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
teacherRouter.delete(
  "/teachers/:id",
  authMiddleware.handle,
  requireRole("teacher"),
  requireSelf("id"),
  teacherController.deleteTeacher.bind(teacherController),
);
