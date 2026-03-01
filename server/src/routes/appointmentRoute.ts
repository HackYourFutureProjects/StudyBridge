import { Router } from "express";
import { container } from "../composition/compositionRoot.js";
import { AppointmentController } from "../controllers/appointment.controller.js";
import { TYPES } from "../composition/composition.types.js";
import { createAppointmentValidationMiddleware } from "../validation/appointment/appointmentValidationMiddleware.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { AuthMiddleware } from "../middlewares/authMiddlewareWithBearer.js";
import {
  idParamValidationMiddleware,
  studentIdParamValidationMiddleware,
  teacherIdParamValidationMiddleware,
  updateAppointmentStatusValidationMiddleware,
} from "../validation/appointment/appointmentValidationMiddleware.js";

export const appointmentRouter = Router();
const appointmentController = container.get<AppointmentController>(
  TYPES.AppointmentController,
);
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

appointmentRouter.post(
  "/test",
  createAppointmentValidationMiddleware(),
  errorMiddleware,
  appointmentController.createAppointmentController.bind(appointmentController),
);

appointmentRouter.post(
  "/",
  createAppointmentValidationMiddleware(),
  errorMiddleware,
  authMiddleware.handle,
  appointmentController.createAppointmentController.bind(appointmentController),
);

appointmentRouter.get(
  "/regular/students",
  authMiddleware.handle,
  appointmentController.getRegularStudentsController.bind(
    appointmentController,
  ),
);

appointmentRouter.get(
  "/regular/teachers",
  authMiddleware.handle,
  appointmentController.getRegularTeachersController.bind(
    appointmentController,
  ),
);

appointmentRouter.post(
  "/:id/set-regular",
  idParamValidationMiddleware(),
  errorMiddleware,
  authMiddleware.handle,
  appointmentController.setRegularStudentController.bind(appointmentController),
);

appointmentRouter.delete(
  "/:id/remove-regular",
  idParamValidationMiddleware(),
  errorMiddleware,
  authMiddleware.handle,
  appointmentController.removeRegularStudentController.bind(
    appointmentController,
  ),
);

appointmentRouter.put(
  "/:id/weekly-schedule",
  idParamValidationMiddleware(),
  errorMiddleware,
  authMiddleware.handle,
  appointmentController.updateWeeklyScheduleController.bind(
    appointmentController,
  ),
);

appointmentRouter.get(
  "/:id",
  idParamValidationMiddleware(),
  errorMiddleware,
  authMiddleware.handle,
  appointmentController.getAppointmentByIdController.bind(
    appointmentController,
  ),
);

appointmentRouter.get(
  "/student/:studentId",
  studentIdParamValidationMiddleware(),
  errorMiddleware,
  authMiddleware.handle,
  appointmentController.getAppointmentsByStudentController.bind(
    appointmentController,
  ),
);

appointmentRouter.get(
  "/teacher/:teacherId",
  teacherIdParamValidationMiddleware(),
  errorMiddleware,
  authMiddleware.handle,
  appointmentController.getAppointmentsByTeacherController.bind(
    appointmentController,
  ),
);

appointmentRouter.get(
  "/teacher/:teacherId/pending",
  teacherIdParamValidationMiddleware(),
  errorMiddleware,
  authMiddleware.handle,
  appointmentController.getPendingAppointmentsByTeacherController.bind(
    appointmentController,
  ),
);

appointmentRouter.put(
  "/:id/status",
  idParamValidationMiddleware(),
  updateAppointmentStatusValidationMiddleware(),
  errorMiddleware,
  authMiddleware.handle,
  appointmentController.updateAppointmentStatusController.bind(
    appointmentController,
  ),
);

appointmentRouter.delete(
  "/:id",
  idParamValidationMiddleware(),
  errorMiddleware,
  authMiddleware.handle,
  appointmentController.deleteAppointmentController.bind(appointmentController),
);
