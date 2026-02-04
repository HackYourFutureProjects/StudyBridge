import { Router } from "express";
import { autStudentValidationMiddleware } from "../validation/auth/studentAuthMiddleware.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { container } from "../composition/compositionRoot.js";
import { AuthController } from "../controllers/auth.controller.js";

export const authRouter = Router();
const authControllerInstance = container.get(AuthController);

authRouter.post(
  "/registration-student",
  autStudentValidationMiddleware(),
  errorMiddleware,
  authControllerInstance.registrationStudentController.bind(
    authControllerInstance,
  ),
);
