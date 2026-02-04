import { Router } from "express";
import { autStudentValidationMiddleware } from "../validation/auth/studentAuthMiddleware.js";
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
