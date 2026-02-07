import { Router } from "express";
import {
  authStudentLoginValidationMiddleware,
  autStudentValidationMiddleware,
} from "../validation/auth/studentAuthMiddleware.js";
import { autTeacherValidationMiddleware } from "../validation/auth/teacherAuthMiddleware.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { container } from "../composition/compositionRoot.js";
import { AuthController } from "../controllers/auth.controller.js";
import { TYPES } from "../composition/composition.types.js";
import { AuthMiddleware } from "../middlewares/authMiddlewareWithBearer.js";
import { VerifyMiddleware } from "../middlewares/verifyToken.middleware.js";

export const authRouter = Router();
const authController = container.get<AuthController>(TYPES.AuthController);
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
const verifyTokenMiddleware = container.get<VerifyMiddleware>(
  TYPES.VerifyMiddleware,
);
authRouter.post(
  "/registration-student",
  autStudentValidationMiddleware(),
  errorMiddleware,
  authController.registrationStudentController.bind(authController),
);

authRouter.post(
  "/registration-teacher",
  autTeacherValidationMiddleware(),
  errorMiddleware,
  authController.registrationTeacherController.bind(authController),
);

authRouter.post(
  "/login-student",
  authStudentLoginValidationMiddleware(),
  errorMiddleware,
  authController.loginStudentController.bind(authController),
);

authRouter.post(
  "/login-teacher",
  authStudentLoginValidationMiddleware(),
  errorMiddleware,
  authController.loginTeacherController.bind(authController),
);

authRouter.get(
  "/me",
  authMiddleware.handle,
  authController.getMe.bind(authController),
);

authRouter.post(
  "/refresh-token",
  verifyTokenMiddleware.verify,
  authController.refreshController.bind(authController),
);
