import { Router } from "express";
import { autStudentValidationMiddleware } from "../middlewares/auth/studentAuthMiddleware.js";

export const authRouter = Router();

authRouter.post(
  "/registration-student",
  autStudentValidationMiddleware(),
  // errorMiddleware,
  // authControllerInstance.registrationController.bind(authControllerInstance),
);
