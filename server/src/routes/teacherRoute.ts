import { Router } from "express";
import { container } from "../composition/compositionRoot.js";
import { TYPES } from "../composition/composition.types.js";
import { TeacherController } from "../controllers/teacher.controller.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { requireSelf } from "../middlewares/requireSelf.middleware.js";
import { AuthMiddleware } from "../middlewares/authMiddlewareWithBearer.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import {
  validateWeekSlotRules,
  validateWeekAvailabilityPayload,
} from "../validation/availabilitySchedule/teacher/teacherScheduleValidationMiddleware.js";

export const teacherRouter = Router();
const teacherController = container.get<TeacherController>(
  TYPES.TeacherController,
);
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
teacherRouter.get(
  "/",
  teacherController.getAllTeachers.bind(teacherController),
);

teacherRouter.put(
  "/me/schedule/week",
  authMiddleware.handle,
  requireRole("teacher"),
  validateWeekAvailabilityPayload(),
  validateWeekSlotRules(),
  errorMiddleware,
  teacherController.replaceAvailabilityForWeek.bind(teacherController),
);

teacherRouter.get(
  "/me/schedule/week",
  authMiddleware.handle,
  requireRole("teacher"),
  teacherController.getMyWeeklyAvailability.bind(teacherController),
);

teacherRouter.get(
  "/:id",
  teacherController.getTeacherById.bind(teacherController),
);

teacherRouter.delete(
  "/:id",
  authMiddleware.handle,
  requireRole("teacher"),
  requireSelf("id"),
  teacherController.deleteTeacher.bind(teacherController),
);
