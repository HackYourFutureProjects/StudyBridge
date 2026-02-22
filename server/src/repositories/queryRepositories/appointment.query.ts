import { injectable } from "inversify";
import { AppointmentModel } from "../../db/schemes/appointmentSchema.js";
import { WithId } from "mongodb";
import { AppointmentTypeDB } from "../../db/schemes/types/appointment.types.js";
import { StudentModel } from "../../db/schemes/studentSchema.js";
import { TeacherModel } from "../../db/schemes/teacherSchema.js";

@injectable()
export class AppointmentQuery {
  async getAppointmentById(
    id: string,
  ): Promise<WithId<AppointmentTypeDB> | null> {
    try {
      return await AppointmentModel.findOne({ id }).lean();
    } catch (err: unknown) {
      throw new Error("Something went wrong with appointment search", {
        cause: err,
      });
    }
  }

  async getAppointmentsByStudent(
    studentId: string,
  ): Promise<WithId<AppointmentTypeDB>[]> {
    try {
      const appointments = await AppointmentModel.find({ studentId })
        .sort({ date: 1, time: 1 })
        .lean();

      return await this.populateNames(appointments);
    } catch (err: unknown) {
      throw new Error("Something went wrong with student appointments search", {
        cause: err,
      });
    }
  }

  async getAppointmentsByTeacher(
    teacherId: string,
  ): Promise<WithId<AppointmentTypeDB>[]> {
    try {
      const appointments = await AppointmentModel.find({ teacherId })
        .sort({ date: 1, time: 1 })
        .lean();

      return await this.populateNames(appointments);
    } catch (err: unknown) {
      throw new Error("Something went wrong with teacher appointments search", {
        cause: err,
      });
    }
  }

  async getPendingAppointmentsByTeacher(
    teacherId: string,
  ): Promise<WithId<AppointmentTypeDB>[]> {
    try {
      const appointments = await AppointmentModel.find({
        teacherId,
        status: "pending",
      })
        .sort({ date: 1, time: 1 })
        .lean();

      return await this.populateNames(appointments);
    } catch (err: unknown) {
      throw new Error("Something went wrong with pending appointments search", {
        cause: err,
      });
    }
  }

  private async populateNames(
    appointments: WithId<AppointmentTypeDB>[],
  ): Promise<WithId<AppointmentTypeDB>[]> {
    return await Promise.all(
      appointments.map(async (apt) => {
        const teacher = await TeacherModel.findOne(
          { id: apt.teacherId },
          { firstName: 1, lastName: 1 },
        ).lean();
        const student = await StudentModel.findOne(
          { id: apt.studentId },
          { firstName: 1, lastName: 1 },
        ).lean();

        return {
          ...apt,
          teacher: teacher
            ? `${teacher.firstName} ${teacher.lastName}`
            : apt.teacher,
          student: student
            ? `${student.firstName} ${student.lastName}`
            : apt.student,
        };
      }),
    );
  }
}
