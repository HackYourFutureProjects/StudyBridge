import { Router } from "express";
import { container } from "../composition/compositionRoot.js";
import { TYPES } from "../composition/composition.types.js";
import { StudentController } from "../controllers/student.controller.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { requireSelf } from "../middlewares/requireSelf.middleware.js";
import { AuthMiddleware } from "../middlewares/authMiddlewareWithBearer.js";

export const studentRouter = Router();
const studentController = container.get<StudentController>(
  TYPES.StudentController,
);
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

studentRouter.get(
  "/me",
  authMiddleware.handle,
  requireRole("student"),
  studentController.getMyProfile.bind(studentController),
);

studentRouter.put(
  "/me",
  authMiddleware.handle,
  requireRole("student"),
  studentController.updateMyProfile.bind(studentController),
);

studentRouter.delete(
  "/:id",
  authMiddleware.handle,
  requireRole("student"),
  requireSelf("id"),
  studentController.deleteStudent.bind(studentController),
);
