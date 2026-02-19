import { injectable } from "inversify";
import { inject } from "inversify";
import {
  RequestWithBody,
  RequestWithParams,
  ParamsType,
} from "../types/common.types.js";
import { NextFunction, Response } from "express";
import { TYPES } from "../composition/composition.types.js";
import { AppointmentService } from "../services/appointment/appointment.service.js";
import {
  CreateAppointmentType,
  UpdateAppointmentStatusType,
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
    req: RequestWithParams<{ studentId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const appointments =
        await this.appointmentService.getAppointmentsByStudent(
          req.params.studentId,
        );
      return res.status(200).json(appointments);
    } catch (error) {
      return next(error);
    }
  }

  async getAppointmentsByTeacherController(
    req: RequestWithParams<{ teacherId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const appointments =
        await this.appointmentService.getAppointmentsByTeacher(
          req.params.teacherId,
        );
      return res.status(200).json(appointments);
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
}
