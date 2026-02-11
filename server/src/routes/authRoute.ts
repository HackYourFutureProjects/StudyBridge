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
import { RefreshTokenMiddleware } from "../middlewares/refreshToken.middleware.js";
import { accessCounterMiddleware } from "../middlewares/accessCounter.middleware.js";
import { passwordResetValidationMiddleware } from "../validation/auth/passwordResetMiddleware.js";

export const authRouter = Router();
const authController = container.get<AuthController>(TYPES.AuthController);
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
const refreshTokenMiddleware = container.get<RefreshTokenMiddleware>(
  TYPES.RefreshTokenMiddleware,
);

authRouter.post(
  "/registration-student",
  accessCounterMiddleware,
  autStudentValidationMiddleware(),
  errorMiddleware,
  authController.registrationStudentController.bind(authController),
);

authRouter.post(
  "/registration-teacher",
  accessCounterMiddleware,
  autTeacherValidationMiddleware(),
  errorMiddleware,
  authController.registrationTeacherController.bind(authController),
);

authRouter.post(
  "/login-student",
  accessCounterMiddleware,
  authStudentLoginValidationMiddleware(),
  errorMiddleware,
  authController.loginStudentController.bind(authController),
);

authRouter.post(
  "/login-teacher",
  accessCounterMiddleware,
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
  accessCounterMiddleware,
  refreshTokenMiddleware.handle,
  authController.refreshController.bind(authController),
);

authRouter.post(
  "/request-password-reset-student",
  passwordResetValidationMiddleware(),
  errorMiddleware,
  authController.requestPasswordResetStudentController.bind(authController),
);
