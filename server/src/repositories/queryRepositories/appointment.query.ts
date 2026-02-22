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
    if (appointments.length === 0) return appointments;

    const uniqueTeacherIds = [
      ...new Set(appointments.map((apt) => apt.teacherId)),
    ];
    const uniqueStudentIds = [
      ...new Set(appointments.map((apt) => apt.studentId)),
    ];

    const [teachers, students] = await Promise.all([
      TeacherModel.find(
        { id: { $in: uniqueTeacherIds } },
        { id: 1, firstName: 1, lastName: 1 },
      ).lean(),
      StudentModel.find(
        { id: { $in: uniqueStudentIds } },
        { id: 1, firstName: 1, lastName: 1 },
      ).lean(),
    ]);

    const teacherMap = new Map(
      teachers.map((t) => [t.id, `${t.firstName} ${t.lastName}`]),
    );
    const studentMap = new Map(
      students.map((s) => [s.id, `${s.firstName} ${s.lastName}`]),
    );

    return appointments.map((apt) => ({
      ...apt,
      teacher: teacherMap.get(apt.teacherId) || apt.teacher,
      student: studentMap.get(apt.studentId) || apt.student,
    }));
  }
}
