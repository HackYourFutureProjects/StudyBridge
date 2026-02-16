import { Router } from "express";
import { container } from "../composition/compositionRoot.js";
import { TYPES } from "../composition/composition.types.js";
import { TeacherController } from "../controllers/teacher.controller.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { requireSelf } from "../middlewares/requireSelf.middleware.js";
import { AuthMiddleware } from "../middlewares/authMiddlewareWithBearer.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import {
  dayParamValidationMiddleware,
  dayQueryValidationMiddleware,
  duplicateOrOverlapSlotsValidationMiddleware,
  slotRangeValidationMiddleware,
  slotsValidationMiddleware,
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

teacherRouter.delete(
  "/:id",
  authMiddleware.handle,
  requireRole("teacher"),
  requireSelf("id"),
  teacherController.deleteTeacher.bind(teacherController),
);

teacherRouter.put(
  "/me/schedule/:day/slots",
  dayParamValidationMiddleware(),
  slotsValidationMiddleware(),
  slotRangeValidationMiddleware(),
  duplicateOrOverlapSlotsValidationMiddleware(),
  errorMiddleware,
  authMiddleware.handle,
  requireRole("teacher"),
  teacherController.addSlotsToSchedule.bind(teacherController),
);

teacherRouter.get(
  "/me/availability",
  dayQueryValidationMiddleware(),
  errorMiddleware,
  authMiddleware.handle,
  requireRole("teacher"),
  teacherController.getTeacherAvailability.bind(teacherController),
);
