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
import { StudentModel } from "../../db/schemes/studentSchema.js";
import { TeacherModel } from "../../db/schemes/teacherSchema.js";
import { ConversationCommand } from "../../repositories/commandRepositories/conversation.command.js";
import { logError, logWarning } from "../../utils/logging.js";

@injectable()
export class AppointmentService {
  constructor(
    @inject(TYPES.AppointmentCommand)
    protected appointmentCommand: AppointmentCommand,
    @inject(TYPES.AppointmentQuery)
    protected appointmentQuery: AppointmentQuery,
    @inject(TYPES.ConversationCommand)
    protected conversationCommand: ConversationCommand,
  ) {}

  async createAppointment(data: CreateAppointmentType) {
    const student = await StudentModel.findOne({ id: data.studentId });
    if (!student) {
      throw new Error("Student not found");
    }

    const teacher = await TeacherModel.findOne({ id: data.teacherId });
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    if (data.teacherId === data.studentId) {
      throw new Error("Teachers cannot book appointments with themselves");
    }

    const appointment = {
      id: randomUUID(),
      studentId: data.studentId,
      teacherId: data.teacherId,
      lesson: data.lesson,
      level: data.level || "",
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

  async getAppointmentsByTeacher(
    teacherId: string,
    page?: number,
    limit?: number,
  ) {
    const result = await this.appointmentQuery.getAppointmentsByTeacher(
      teacherId,
      page,
      limit,
    );
    return {
      appointments: result.appointments.map((apt) =>
        this.formatAppointmentResponse(apt),
      ),
      total: result.total,
      totalPages: result.totalPages,
    };
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
    if (!updated) {
      return null;
    }

    try {
      const ok = await this.conversationCommand.upsertForAppointment({
        appointmentId: updated.id,
        studentId: updated.studentId,
        teacherId: updated.teacherId,
        status: updated.status,
      });

      if (!ok) {
        logWarning("Conversation upsert returned false");
      }
    } catch (err) {
      logError(err);
      logWarning("Conversation upsert failed");
    }

    return this.formatAppointmentResponse(updated);

    // const updated = await this.appointmentCommand.updateAppointment(
    //   id,
    //   updateData,
    // );
    // return updated ? this.formatAppointmentResponse(updated) : null;
  }

  async deleteAppointment(id: string, userId: string) {
    const appointment = await this.appointmentQuery.getAppointmentById(id);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.teacherId !== userId && appointment.studentId !== userId) {
      throw new Error("Unauthorized to delete this appointment");
    }

    const [hours, minutes] = appointment.time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error("Invalid appointment time format");
    }

    const appointmentDateTime = new Date(appointment.date);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();

    if (appointmentDateTime >= now) {
      throw new Error("You cannot delete future lesson");
    }

    await this.appointmentCommand.deleteAppointment(id);
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
      level?: string;
      teacherId: string;
      studentId: string;
      price: string | number;
      date: string;
      time: string;
      status: string;
      videoCall?: string;
    };

    const priceStr =
      typeof apt.price === "string" ? apt.price : String(apt.price);

    return {
      id: apt.id,
      lesson: apt.lesson,
      level: apt.level,
      teacherId: apt.teacherId,
      studentId: apt.studentId,
      price: priceStr,
      date: apt.date,
      time: apt.time,
      status: apt.status,
      videoCall: apt.videoCall,
    };
  }
}
