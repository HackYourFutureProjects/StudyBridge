import { injectable } from "inversify";
import { AppointmentRepository } from "../../repositories/appointment.repository.js";
import { inject } from "inversify";
import { TYPES } from "../../composition/composition.types.js";
import { randomUUID } from "node:crypto";
import {
  CreateAppointmentType,
  UpdateAppointmentStatusType,
} from "../../types/appointment/appointment.types.js";

@injectable()
export class AppointmentService {
  constructor(
    @inject(TYPES.AppointmentRepository)
    protected appointmentRepository: AppointmentRepository,
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
      await this.appointmentRepository.createAppointment(appointment);

    return this.formatAppointmentResponse(created);
  }

  async getAppointmentById(id: string) {
    const appointment = await this.appointmentRepository.getAppointmentById(id);
    return appointment ? this.formatAppointmentResponse(appointment) : null;
  }

  async getAppointmentsByStudent(studentId: string) {
    const appointments =
      await this.appointmentRepository.getAppointmentsByStudent(studentId);
    return appointments.map((apt) => this.formatAppointmentResponse(apt));
  }

  async getAppointmentsByTeacher(teacherId: string) {
    const appointments =
      await this.appointmentRepository.getAppointmentsByTeacher(teacherId);
    return appointments.map((apt) => this.formatAppointmentResponse(apt));
  }

  async updateAppointmentStatus(id: string, data: UpdateAppointmentStatusType) {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const updated = await this.appointmentRepository.updateAppointment(
      id,
      updateData,
    );
    return updated ? this.formatAppointmentResponse(updated) : null;
  }

  async getPendingAppointmentsByTeacher(teacherId: string) {
    const appointments =
      await this.appointmentRepository.getPendingAppointmentsByTeacher(
        teacherId,
      );
    return appointments.map((apt) => this.formatAppointmentResponse(apt));
  }

  private formatAppointmentResponse(appointment: unknown) {
    const apt = appointment as {
      id: string;
      lesson: string;
      teacherId: string;
      studentId: string;
      price: number;
      startTime: Date;
      status: string;
      videoCall?: string;
    };
    const startTime = new Date(apt.startTime);

    return {
      id: apt.id,
      lesson: apt.lesson,
      teacher: apt.teacherId,
      student: apt.studentId,
      price: apt.price.toString(),
      date: startTime.toISOString().split("T")[0],
      time: startTime.toTimeString().slice(0, 5),
      status: apt.status,
      videoCall: apt.videoCall,
    };
  }
}
