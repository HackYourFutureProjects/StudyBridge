import { StudentModel } from "../../db/schemes/studentSchema.js";
import { TeacherModel } from "../../db/schemes/teacherSchema.js";
import { CreateAppointmentType } from "../../types/appointment/appointment.types.js";
import { AppointmentScheduleValidation } from "./appointmentScheduleValidation.js";
import { APPOINTMENT_VALIDATION_CONSTANTS } from "./appointmentValidation.constants.js";
import { HttpError } from "../../utils/error.util.js";
import { container } from "../../composition/compositionRoot.js";
import { TYPES } from "../../composition/composition.types.js";
import { AppointmentQuery } from "../../repositories/queryRepositories/appointment.query.js";

export class AppointmentBusinessValidation {
  private static get appointmentQuery(): AppointmentQuery {
    return container.get<AppointmentQuery>(TYPES.AppointmentQuery);
  }

  static async validateStudentExists(studentId: string) {
    const student = await StudentModel.findOne({ id: studentId });
    if (!student) {
      throw new HttpError(
        404,
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.STUDENT_NOT_FOUND,
      );
    }
    return student;
  }

  static async validateTeacherExists(teacherId: string) {
    const teacher = await TeacherModel.findOne({ id: teacherId });
    if (!teacher) {
      throw new HttpError(
        404,
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.TEACHER_NOT_FOUND,
      );
    }
    return teacher;
  }

  static validateNotSelfBooking(teacherId: string, studentId: string) {
    if (teacherId === studentId) {
      throw new HttpError(
        400,
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
      throw new HttpError(
        400,
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
        throw new HttpError(
          400,
          APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.PAST_TIME,
        );
      }
    }

    AppointmentScheduleValidation.validateMinimumAdvanceTime(date, time);
    AppointmentScheduleValidation.validateMaximumAdvanceTime(date);
  }

  static async validateNoDuplicateAppointment(
    studentId: string,
    date: string,
    time: string,
  ) {
    const existingAppointment =
      await this.appointmentQuery.findExistingAppointment(
        studentId,
        date,
        time,
      );

    if (existingAppointment) {
      throw new HttpError(
        409,
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.DUPLICATE_APPOINTMENT,
      );
    }
  }

  static async validateCreateAppointment(data: CreateAppointmentType) {
    await Promise.all([
      this.validateStudentExists(data.studentId),
      this.validateTeacherExists(data.teacherId),
      this.validateNoDuplicateAppointment(data.studentId, data.date, data.time),
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
      throw new HttpError(
        403,
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED_DELETE,
      );
    }
  }

  static validateTeacherAuthorization(
    appointment: { teacherId: string },
    teacherId: string,
  ) {
    if (appointment.teacherId !== teacherId) {
      throw new HttpError(
        403,
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED_MODIFY,
      );
    }
  }

  static validateRegularStudent(appointment: { isRegularStudent?: boolean }) {
    if (!appointment.isRegularStudent) {
      throw new HttpError(
        400,
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.NOT_REGULAR_STUDENT,
      );
    }
  }

  static validateAppointmentExists(
    appointment: unknown,
  ): asserts appointment is NonNullable<typeof appointment> {
    if (!appointment) {
      throw new HttpError(
        404,
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
