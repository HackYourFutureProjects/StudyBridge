import { injectable } from "inversify";
import { inject } from "inversify";
import { TYPES } from "../../composition/composition.types.js";
import { randomUUID } from "node:crypto";
import {
  CreateAppointmentType,
  UpdateAppointmentStatusType,
} from "../../types/appointment/appointment.types.js";
import { AppointmentCommand } from "../../repositories/commandRepositories/appointment.command.js";
import { AppointmentQuery } from "../../repositories/queryRepositories/appointment.query.js";

@injectable()
export class AppointmentService {
  constructor(
    @inject(TYPES.AppointmentCommand)
    protected appointmentCommand: AppointmentCommand,
    @inject(TYPES.AppointmentQuery)
    protected appointmentQuery: AppointmentQuery,
  ) {}

  async createAppointment(data: CreateAppointmentType) {
    const appointment = {
      id: randomUUID(),
      studentId: data.studentId,
      teacherId: data.teacherId,
      lesson: data.lesson,
      teacher: data.teacherId,
      student: data.studentId,
      price: data.price,
      date: data.date,
      time: data.time,
      status: "pending" as const,
      videoCall: `https://meet.google.com/${data.teacherId}-${data.studentId}-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created =
      await this.appointmentCommand.createAppointment(appointment);

    return this.formatAppointmentResponse(created);
  }

  async getAppointmentById(id: string) {
    const appointment = await this.appointmentQuery.getAppointmentById(id);
    return appointment ? this.formatAppointmentResponse(appointment) : null;
  }

  async getAppointmentsByStudent(studentId: string) {
    const appointments =
      await this.appointmentQuery.getAppointmentsByStudent(studentId);
    return appointments.map((apt) => this.formatAppointmentResponse(apt));
  }

  async getAppointmentsByTeacher(teacherId: string) {
    const appointments =
      await this.appointmentQuery.getAppointmentsByTeacher(teacherId);
    return appointments.map((apt) => this.formatAppointmentResponse(apt));
  }

  async updateAppointmentStatus(id: string, data: UpdateAppointmentStatusType) {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const updated = await this.appointmentCommand.updateAppointment(
      id,
      updateData,
    );
    return updated ? this.formatAppointmentResponse(updated) : null;
  }

  async getPendingAppointmentsByTeacher(teacherId: string) {
    const appointments =
      await this.appointmentQuery.getPendingAppointmentsByTeacher(teacherId);
    return appointments.map((apt) => this.formatAppointmentResponse(apt));
  }

  private formatAppointmentResponse(appointment: unknown) {
    const apt = appointment as {
      id: string;
      lesson: string;
      teacherId: string;
      studentId: string;
      price: number;
      date: string;
      time: string;
      status: string;
      videoCall?: string;
    };

    return {
      id: apt.id,
      lesson: apt.lesson,
      teacher: apt.teacherId,
      student: apt.studentId,
      price: apt.price.toString(),
      date: apt.date,
      time: apt.time,
      status: apt.status,
      videoCall: apt.videoCall,
    };
  }
}
