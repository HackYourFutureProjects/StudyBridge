import { injectable } from "inversify";
import { inject } from "inversify";
import {
  RequestWithBody,
  RequestWithParams,
  ParamsType,
  RequestWithQuery,
} from "../types/common.types.js";
import { NextFunction, Response } from "express";
import { TYPES } from "../composition/composition.types.js";
import { AppointmentService } from "../services/appointment/appointment.service.js";
import {
  CreateAppointmentType,
  UpdateAppointmentStatusType,
  UpdateWeeklyScheduleType,
} from "../types/appointment/appointment.types.js";

@injectable()
export class AppointmentController {
  constructor(
    @inject(TYPES.AppointmentService)
    protected appointmentService: AppointmentService,
  ) {}

  async createAppointmentController(
    req: RequestWithBody<CreateAppointmentType>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const appointment = await this.appointmentService.createAppointment(
        req.body,
      );
      res.status(201).json(appointment);
    } catch (error) {
      return next(error);
    }
  }

  async getAppointmentByIdController(
    req: RequestWithParams<ParamsType>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const appointment = await this.appointmentService.getAppointmentById(
        req.params.id,
      );

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      return res.status(200).json(appointment);
    } catch (error) {
      return next(error);
    }
  }

  async getAppointmentsByStudentController(
    req: RequestWithParams<{ studentId: string }> &
      RequestWithQuery<{ page?: string; limit?: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let page: number | undefined;
      let limit: number | undefined;

      if (req.query.page) {
        page = parseInt(req.query.page, 10);
        if (isNaN(page)) {
          return res.status(400).json({ message: "Invalid page parameter" });
        }
      }

      if (req.query.limit) {
        limit = parseInt(req.query.limit, 10);
        if (isNaN(limit)) {
          return res.status(400).json({ message: "Invalid limit parameter" });
        }
      }

      const result = await this.appointmentService.getAppointmentsByStudent(
        req.params.studentId,
        page,
        limit,
      );
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async getAppointmentsByTeacherController(
    req: RequestWithParams<{ teacherId: string }> &
      RequestWithQuery<{ page?: string; limit?: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let page: number | undefined;
      let limit: number | undefined;

      if (req.query.page) {
        page = parseInt(req.query.page, 10);
        if (isNaN(page)) {
          return res.status(400).json({ message: "Invalid page parameter" });
        }
      }

      if (req.query.limit) {
        limit = parseInt(req.query.limit, 10);
        if (isNaN(limit)) {
          return res.status(400).json({ message: "Invalid limit parameter" });
        }
      }

      const result = await this.appointmentService.getAppointmentsByTeacher(
        req.params.teacherId,
        page,
        limit,
      );
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async getPendingAppointmentsByTeacherController(
    req: RequestWithParams<{ teacherId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const appointments =
        await this.appointmentService.getPendingAppointmentsByTeacher(
          req.params.teacherId,
        );
      return res.status(200).json(appointments);
    } catch (error) {
      return next(error);
    }
  }

  async updateAppointmentStatusController(
    req: RequestWithParams<ParamsType> &
      RequestWithBody<UpdateAppointmentStatusType>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const appointment = await this.appointmentService.updateAppointmentStatus(
        req.params.id,
        req.body,
      );

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      return res.status(200).json(appointment);
    } catch (error) {
      return next(error);
    }
  }

  async deleteAppointmentController(
    req: RequestWithParams<ParamsType>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await this.appointmentService.deleteAppointment(req.params.id, userId);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }

  async setRegularStudentController(
    req: RequestWithParams<ParamsType>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const teacherId = req.auth?.userId;
      if (!teacherId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const appointment = await this.appointmentService.setRegularStudent(
        req.params.id,
        teacherId,
      );

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.json(appointment);
    } catch (error) {
      return next(error);
    }
  }

  async removeRegularStudentController(
    req: RequestWithParams<ParamsType>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const teacherId = req.auth?.userId;
      if (!teacherId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const appointment = await this.appointmentService.removeRegularStudent(
        req.params.id,
        teacherId,
      );

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.json(appointment);
    } catch (error) {
      return next(error);
    }
  }

  async updateWeeklyScheduleController(
    req: RequestWithBody<UpdateWeeklyScheduleType> &
      RequestWithParams<ParamsType>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const teacherId = req.auth?.userId;
      if (!teacherId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const appointment = await this.appointmentService.updateWeeklySchedule(
        req.params.id,
        teacherId,
        req.body.weeklySchedule,
      );

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.json(appointment);
    } catch (error) {
      return next(error);
    }
  }

  async getRegularStudentsController(
    req: RequestWithQuery<{ page?: string; limit?: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const teacherId = req.auth?.userId;
      if (!teacherId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      let page: number | undefined;
      let limit: number | undefined;

      if (req.query.page) {
        page = parseInt(req.query.page, 10);
        if (isNaN(page)) {
          return res.status(400).json({ message: "Invalid page parameter" });
        }
      }

      if (req.query.limit) {
        limit = parseInt(req.query.limit, 10);
        if (isNaN(limit)) {
          return res.status(400).json({ message: "Invalid limit parameter" });
        }
      }

      const result = await this.appointmentService.getRegularStudentsByTeacher(
        teacherId,
        page,
        limit,
      );

      res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async getRegularTeachersController(
    req: RequestWithQuery<{ page?: string; limit?: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const studentId = req.auth?.userId;
      if (!studentId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      let page: number | undefined;
      let limit: number | undefined;

      if (req.query.page) {
        page = parseInt(req.query.page, 10);
        if (isNaN(page)) {
          return res.status(400).json({ message: "Invalid page parameter" });
        }
      }

      if (req.query.limit) {
        limit = parseInt(req.query.limit, 10);
        if (isNaN(limit)) {
          return res.status(400).json({ message: "Invalid limit parameter" });
        }
      }

      const result = await this.appointmentService.getRegularTeachersByStudent(
        studentId,
        page,
        limit,
      );

      res.json(result);
    } catch (error) {
      return next(error);
    }
  }
}
