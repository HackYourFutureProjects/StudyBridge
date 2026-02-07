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

export const authRouter = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

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
