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
import { VideoCallModel } from "../../db/schemes/videoCallSchema.js";

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

    const appointmentDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      throw new Error("Cannot create appointments in the past");
    }

    if (appointmentDate.getTime() === today.getTime()) {
      const [hours, minutes] = data.time.split(":").map(Number);
      const appointmentDateTime = new Date(data.date);
      appointmentDateTime.setHours(hours, minutes, 0, 0);

      const now = new Date();
      if (appointmentDateTime < now) {
        throw new Error(
          "Cannot create appointments for times that have already passed",
        );
      }
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
      description: data.description || "",
      status: "pending" as const,
      videoCall: `https://meet.google.com/${data.teacherId}-${data.studentId}-${Date.now()}`,
      isRegularStudent: false,
      weeklySchedule: [],
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

  async getAppointmentsByStudent(
    studentId: string,
    page?: number,
    limit?: number,
  ) {
    const result = await this.appointmentQuery.getAppointmentsByStudent(
      studentId,
      page,
      limit,
    );
    const appointmentsWithNames = await this.appointmentQuery.populateNames(
      result.appointments,
    );

    const appointmentsWithVideoLinks =
      await this.attachVideoCallLinksToAppointments(appointmentsWithNames);

    return {
      appointments: appointmentsWithVideoLinks.map((apt) =>
        this.formatAppointmentResponse(apt),
      ),
      total: result.total,
      totalPages: result.totalPages,
    };
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
    const appointmentsWithNames = await this.appointmentQuery.populateNames(
      result.appointments,
    );

    const appointmentsWithVideoLinks =
      await this.attachVideoCallLinksToAppointments(appointmentsWithNames);

    return {
      appointments: appointmentsWithVideoLinks.map((apt) =>
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

    const updateData = {
      status: "rejected" as const,
      updatedAt: new Date(),
    };

    const updated = await this.appointmentCommand.updateAppointment(
      id,
      updateData,
    );

    if (!updated) {
      throw new Error("Failed to update appointment status");
    }

    try {
      await this.conversationCommand.upsertForAppointment({
        appointmentId: updated.id,
        studentId: updated.studentId,
        teacherId: updated.teacherId,
        status: updated.status,
      });
    } catch (err) {
      logError(err);
      logWarning("Conversation upsert failed during appointment deletion");
    }

    await this.appointmentCommand.deleteAppointment(id);
  }

  async getPendingAppointmentsByTeacher(teacherId: string) {
    const appointments =
      await this.appointmentQuery.getPendingAppointmentsByTeacher(teacherId);
    return appointments.map((apt) => this.formatAppointmentResponse(apt));
  }

  // Create the call link that students can click to open this exact video call.
  private buildVideoCallJoinUrl(
    callId: string,
    streamCallId: string,
    streamCallType?: string,
  ): string {
    const type = streamCallType || "default";

    return `/call/${callId}?streamCallId=${encodeURIComponent(
      streamCallId,
    )}&streamCallType=${encodeURIComponent(type)}`;
  }

  private async attachVideoCallLinksToAppointments<
    T extends { id: string; videoCall?: string },
  >(appointments: T[]): Promise<T[]> {
    const now = new Date();
    const MISSED_JOIN_GRACE_MS = 3 * 60 * 60 * 1000; // 3 hours
    const appointmentIds = appointments.map((a) => a.id).filter(Boolean);

    if (!appointmentIds.length) return appointments;

    const calls = await VideoCallModel.find({
      appointmentId: { $in: appointmentIds },
      $or: [
        // include ringing even if popup expiry passed; accept flow can still convert it.
        { status: "ringing" },
        { status: "accepted", expiresAt: { $gt: now } },
        {
          status: "missed",
          createdAt: { $gt: new Date(now.getTime() - MISSED_JOIN_GRACE_MS) },
        },
      ],
    })
      .sort({ createdAt: -1 })
      .select("id appointmentId streamCallId streamCallType")
      .lean();

    const latestByAppointmentId = new Map<string, (typeof calls)[number]>();
    for (const call of calls) {
      if (!call.appointmentId) continue;
      if (!latestByAppointmentId.has(call.appointmentId)) {
        latestByAppointmentId.set(call.appointmentId, call);
      }
    }

    return appointments.map((appointment) => {
      const call = latestByAppointmentId.get(appointment.id);
      if (!call) return appointment;

      return {
        ...appointment,
        videoCall: this.buildVideoCallJoinUrl(
          call.id,
          call.streamCallId,
          call.streamCallType,
        ),
      };
    });
  }

  private formatAppointmentResponse(appointment: unknown) {
    const apt = appointment as {
      id: string;
      lesson: string;
      level?: string;
      teacherId: string;
      studentId: string;
      teacherName?: string;
      studentName?: string;
      studentProfileImageUrl?: string | null;
      price: string | number;
      date: string;
      time: string;
      description?: string;
      status: string;
      videoCall?: string;
      isRegularStudent?: boolean;
      weeklySchedule?: { day: string; hour: number }[];
      addedToRegularAt?: Date;
    };

    const priceStr =
      typeof apt.price === "string" ? apt.price : String(apt.price);

    return {
      id: apt.id,
      lesson: apt.lesson,
      level: apt.level,
      teacherId: apt.teacherId,
      studentId: apt.studentId,
      teacherName: apt.teacherName,
      studentName: apt.studentName,
      studentProfileImageUrl: apt.studentProfileImageUrl,
      price: priceStr,
      date: apt.date,
      time: apt.time,
      description: apt.description,
      status: apt.status,
      videoCall: apt.videoCall,
      isRegularStudent: apt.isRegularStudent,
      weeklySchedule: apt.weeklySchedule,
      addedToRegularAt: apt.addedToRegularAt,
    };
  }

  async setRegularStudent(id: string, teacherId: string) {
    const appointment = await this.appointmentQuery.getAppointmentById(id);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.teacherId !== teacherId) {
      throw new Error("Unauthorized to modify this appointment");
    }

    const updated = await this.appointmentCommand.setRegularStudent(id);
    return updated ? this.formatAppointmentResponse(updated) : null;
  }

  async removeRegularStudent(id: string, teacherId: string) {
    const appointment = await this.appointmentQuery.getAppointmentById(id);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.teacherId !== teacherId) {
      throw new Error("Unauthorized to modify this appointment");
    }

    const updated = await this.appointmentCommand.removeRegularStudent(id);
    return updated ? this.formatAppointmentResponse(updated) : null;
  }

  async updateWeeklySchedule(
    id: string,
    teacherId: string,
    weeklySchedule: { day: string; hour: number }[],
  ) {
    const appointment = await this.appointmentQuery.getAppointmentById(id);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.teacherId !== teacherId) {
      throw new Error("Unauthorized to modify this appointment");
    }

    if (!appointment.isRegularStudent) {
      throw new Error("Cannot set weekly schedule for a non-regular student");
    }

    const updated = await this.appointmentCommand.updateWeeklySchedule(
      id,
      weeklySchedule,
    );
    return updated ? this.formatAppointmentResponse(updated) : null;
  }

  async getRegularStudentsByTeacher(
    teacherId: string,
    page?: number,
    limit?: number,
  ) {
    const result = await this.appointmentQuery.getRegularStudentsByTeacher(
      teacherId,
      page,
      limit,
    );
    const appointmentsWithNames = await this.appointmentQuery.populateNames(
      result.appointments,
    );

    return {
      appointments: appointmentsWithNames.map((apt) =>
        this.formatAppointmentResponse(apt),
      ),
      total: result.total,
      totalPages: result.totalPages,
    };
  }

  async getRegularTeachersByStudent(
    studentId: string,
    page?: number,
    limit?: number,
  ) {
    const result = await this.appointmentQuery.getRegularTeachersByStudent(
      studentId,
      page,
      limit,
    );
    const appointmentsWithNames = await this.appointmentQuery.populateNames(
      result.appointments,
    );

    return {
      appointments: appointmentsWithNames.map((apt) =>
        this.formatAppointmentResponse(apt),
      ),
      total: result.total,
      totalPages: result.totalPages,
    };
  }
}
