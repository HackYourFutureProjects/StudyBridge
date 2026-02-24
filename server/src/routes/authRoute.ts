import { Router } from "express";
import {
  authLoginValidationMiddleware,
  authRegistrationValidationMiddleware,
} from "../validation/auth/studentAuthMiddleware.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { container } from "../composition/compositionRoot.js";
import { AuthController } from "../controllers/auth.controller.js";
import { TYPES } from "../composition/composition.types.js";
import { AuthMiddleware } from "../middlewares/authMiddlewareWithBearer.js";
import { RefreshTokenMiddleware } from "../middlewares/refreshToken.middleware.js";
import { accessCounterMiddleware } from "../middlewares/accessCounter.middleware.js";
import {
  passwordResetValidationMiddleware,
  sendPasswordResetValidationMiddleware,
} from "../validation/auth/passwordResetMiddleware.js";

export const authRouter = Router();
const authController = container.get<AuthController>(TYPES.AuthController);
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
const refreshTokenMiddleware = container.get<RefreshTokenMiddleware>(
  TYPES.RefreshTokenMiddleware,
);

authRouter.post(
  "/registration",
  accessCounterMiddleware,
  authRegistrationValidationMiddleware(),
  errorMiddleware,
  authController.registrationUserController.bind(authController),
);

authRouter.post(
  "/login-student",
  accessCounterMiddleware,
  authLoginValidationMiddleware(),
  errorMiddleware,
  authController.loginStudentController.bind(authController),
);

authRouter.post(
  "/login-teacher",
  accessCounterMiddleware,
  authLoginValidationMiddleware(),
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
  accessCounterMiddleware,
  passwordResetValidationMiddleware(),
  errorMiddleware,
  authController.requestPasswordResetStudentController.bind(authController),
);

authRouter.post(
  "/request-password-reset-teacher",
  accessCounterMiddleware,
  passwordResetValidationMiddleware(),
  errorMiddleware,
  authController.requestPasswordResetTeacherController.bind(authController),
);

authRouter.post(
  "/reset-password",
  accessCounterMiddleware,
  sendPasswordResetValidationMiddleware(),
  errorMiddleware,
  authController.resetPasswordController.bind(authController),
);

// Logout route
authRouter.post(
  "/logout",
  authMiddleware.handle,
  authController.logoutController.bind(authController),
);
