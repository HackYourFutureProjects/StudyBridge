import { injectable } from "inversify";
import { AppointmentModel } from "../../db/schemes/appointmentSchema.js";
import { WithId } from "mongodb";
import { AppointmentTypeDB } from "../../db/schemes/types/appointment.types.js";

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
    page?: number,
    limit?: number,
  ): Promise<{
    appointments: WithId<AppointmentTypeDB>[];
    total: number;
    totalPages: number;
  }> {
    try {
      const query = { studentId };
      const total = await AppointmentModel.countDocuments(query);

      if (page && limit) {
        const skip = (page - 1) * limit;
        const appointments = await AppointmentModel.find(query)
          .sort({ date: 1, time: 1 })
          .skip(skip)
          .limit(limit)
          .lean();

        return {
          appointments,
          total,
          totalPages: Math.ceil(total / limit),
        };
      }

      const appointments = await AppointmentModel.find(query)
        .sort({ date: 1, time: 1 })
        .lean();

      return {
        appointments,
        total,
        totalPages: 1,
      };
    } catch (err: unknown) {
      throw new Error("Something went wrong with student appointments search", {
        cause: err,
      });
    }
  }

  async getAppointmentsByTeacher(
    teacherId: string,
    page?: number,
    limit?: number,
  ): Promise<{
    appointments: WithId<AppointmentTypeDB>[];
    total: number;
    totalPages: number;
  }> {
    try {
      const query = { teacherId };
      const total = await AppointmentModel.countDocuments(query);

      if (page && limit) {
        const skip = (page - 1) * limit;
        const appointments = await AppointmentModel.find(query)
          .sort({ date: 1, time: 1 })
          .skip(skip)
          .limit(limit)
          .lean();

        return {
          appointments,
          total,
          totalPages: Math.ceil(total / limit),
        };
      }

      const appointments = await AppointmentModel.find(query)
        .sort({ date: 1, time: 1 })
        .lean();

      return {
        appointments,
        total,
        totalPages: 1,
      };
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
      return await AppointmentModel.find({
        teacherId,
        status: "pending",
      })
        .sort({ date: 1, time: 1 })
        .lean();
    } catch (err: unknown) {
      throw new Error("Something went wrong with pending appointments search", {
        cause: err,
      });
    }
  }

  async populateNames(appointments: WithId<AppointmentTypeDB>[]): Promise<
    Array<
      WithId<AppointmentTypeDB> & {
        teacherName?: string;
        studentName?: string;
      }
    >
  > {
    const teacherIds = [
      ...new Set(appointments.map((apt) => apt.teacherId)),
    ].filter(Boolean);
    const studentIds = [
      ...new Set(appointments.map((apt) => apt.studentId)),
    ].filter(Boolean);

    const [teachers, students] = await Promise.all([
      import("../../db/schemes/teacherSchema.js").then(({ TeacherModel }) =>
        TeacherModel.find({ id: { $in: teacherIds } })
          .select("id firstName lastName")
          .lean(),
      ),
      import("../../db/schemes/studentSchema.js").then(({ StudentModel }) =>
        StudentModel.find({ id: { $in: studentIds } })
          .select("id firstName lastName")
          .lean(),
      ),
    ]);

    const teacherMap = new Map(
      teachers.map((t) => [t.id, `${t.firstName} ${t.lastName}`]),
    );
    const studentMap = new Map(
      students.map((s) => [s.id, `${s.firstName} ${s.lastName}`]),
    );

    return appointments.map((apt) => ({
      ...apt,
      teacherName: teacherMap.get(apt.teacherId),
      studentName: studentMap.get(apt.studentId),
    }));
  }
}
