import { Router } from "express";
import { autStudentValidationMiddleware } from "../validation/auth/studentAuthMiddleware.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";

export const authRouter = Router();

authRouter.post(
  "/registration-student",
  autStudentValidationMiddleware(),
  errorMiddleware,
  // errorMiddleware,
  // authControllerInstance.registrationController.bind(authControllerInstance),
);
