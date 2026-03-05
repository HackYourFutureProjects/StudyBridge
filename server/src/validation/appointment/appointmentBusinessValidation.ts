import { StudentModel } from "../../db/schemes/studentSchema.js";
import { TeacherModel } from "../../db/schemes/teacherSchema.js";
import { CreateAppointmentType } from "../../types/appointment/appointment.types.js";
import { AppointmentScheduleValidation } from "./appointmentScheduleValidation.js";
import { APPOINTMENT_VALIDATION_CONSTANTS } from "./appointmentValidation.constants.js";

export class AppointmentBusinessValidation {
  static async validateStudentExists(studentId: string) {
    const student = await StudentModel.findOne({ id: studentId });
    if (!student) {
      throw new Error(
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.STUDENT_NOT_FOUND,
      );
    }
    return student;
  }

  static async validateTeacherExists(teacherId: string) {
    const teacher = await TeacherModel.findOne({ id: teacherId });
    if (!teacher) {
      throw new Error(
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.TEACHER_NOT_FOUND,
      );
    }
    return teacher;
  }

  static validateNotSelfBooking(teacherId: string, studentId: string) {
    if (teacherId === studentId) {
      throw new Error(
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.SELF_BOOKING,
      );
    }
  }

  static validateAppointmentDate(date: string) {
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      throw new Error(
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.PAST_DATE,
      );
    }

    return appointmentDate;
  }

  static validateAppointmentTime(date: string, time: string) {
    AppointmentScheduleValidation.validateWorkingHours(time);

    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);

    if (appointmentDate.getTime() === today.getTime()) {
      const [hours, minutes] = time.split(":").map(Number);
      const appointmentDateTime = new Date(date);
      appointmentDateTime.setHours(hours, minutes, 0, 0);

      const now = new Date();
      if (appointmentDateTime < now) {
        throw new Error(
          APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.PAST_TIME,
        );
      }
    }

    AppointmentScheduleValidation.validateMinimumAdvanceTime(date, time);
    AppointmentScheduleValidation.validateMaximumAdvanceTime(date);
  }

  static async validateCreateAppointment(data: CreateAppointmentType) {
    await Promise.all([
      this.validateStudentExists(data.studentId),
      this.validateTeacherExists(data.teacherId),
    ]);

    this.validateNotSelfBooking(data.teacherId, data.studentId);
    this.validateAppointmentDate(data.date);
    this.validateAppointmentTime(data.date, data.time);
  }

  static validateDeleteAuthorization(
    appointment: { teacherId: string; studentId: string },
    userId: string,
  ) {
    if (appointment.teacherId !== userId && appointment.studentId !== userId) {
      throw new Error(
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED_DELETE,
      );
    }
  }

  static validateTeacherAuthorization(
    appointment: { teacherId: string },
    teacherId: string,
  ) {
    if (appointment.teacherId !== teacherId) {
      throw new Error(
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED_MODIFY,
      );
    }
  }

  static validateRegularStudent(appointment: { isRegularStudent?: boolean }) {
    if (!appointment.isRegularStudent) {
      throw new Error(
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.NOT_REGULAR_STUDENT,
      );
    }
  }

  static validateAppointmentExists(
    appointment: unknown,
  ): asserts appointment is NonNullable<typeof appointment> {
    if (!appointment) {
      throw new Error(
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.APPOINTMENT_NOT_FOUND,
      );
    }
  }

  static validateWeeklyScheduleData(
    weeklySchedule: { day: string; hour: number }[],
  ) {
    AppointmentScheduleValidation.validateWeeklySchedule(weeklySchedule);
  }
}
