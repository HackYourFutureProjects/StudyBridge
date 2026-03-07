import { injectable } from "inversify";
import { AppointmentModel } from "../../db/schemes/appointmentSchema.js";
import { TeacherModel } from "../../db/schemes/teacherSchema.js";
import { StudentModel } from "../../db/schemes/studentSchema.js";
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
      const query = {
        studentId,
        date: { $exists: true, $ne: "" },
        time: { $exists: true, $ne: "" },
      };
      const total = await AppointmentModel.countDocuments(query);

      if (page !== undefined && limit !== undefined) {
        if (page < 1 || limit < 1) {
          throw new Error("Page and limit must be positive numbers");
        }

        const skip = (page - 1) * limit;
        const appointments = await AppointmentModel.find(query)
          .sort({ date: -1, time: -1 })
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
        .sort({ date: -1, time: -1 })
        .lean();

      return {
        appointments,
        total,
        totalPages: Math.ceil(total / 10) || 1,
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
      const query = {
        teacherId,
        date: { $exists: true, $ne: "" },
        time: { $exists: true, $ne: "" },
      };
      const total = await AppointmentModel.countDocuments(query);

      if (page !== undefined && limit !== undefined) {
        // Validate pagination parameters
        if (page < 1 || limit < 1) {
          throw new Error("Page and limit must be positive numbers");
        }

        const skip = (page - 1) * limit;
        const appointments = await AppointmentModel.find(query)
          .sort({ date: -1, time: -1 })
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
        .sort({ date: -1, time: -1 })
        .lean();

      return {
        appointments,
        total,
        totalPages: Math.ceil(total / 10) || 1,
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
        studentProfileImageUrl?: string | null;
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
      TeacherModel.find({ id: { $in: teacherIds } })
        .select("id firstName lastName")
        .lean(),
      StudentModel.find({ id: { $in: studentIds } })
        .select("id firstName lastName profileImageUrl")
        .lean(),
    ]);

    const teacherMap = new Map(
      teachers.map((t) => [t.id, `${t.firstName} ${t.lastName}`]),
    );
    const studentMap = new Map(
      students.map((s) => [
        s.id,
        {
          name: `${s.firstName} ${s.lastName}`,
          profileImageUrl: s.profileImageUrl,
        },
      ]),
    );

    return appointments.map((apt) => {
      const studentData = studentMap.get(apt.studentId);
      return {
        ...apt,
        teacherName: teacherMap.get(apt.teacherId),
        studentName: studentData?.name,
        studentProfileImageUrl: studentData?.profileImageUrl,
      };
    });
  }

  async getRegularStudentsByTeacher(
    teacherId: string,
    page?: number,
    limit?: number,
  ): Promise<{
    appointments: WithId<AppointmentTypeDB>[];
    total: number;
    totalPages: number;
  }> {
    try {
      const query = {
        teacherId,
        isRegularStudent: true,
      };
      const total = await AppointmentModel.countDocuments(query);

      if (page !== undefined && limit !== undefined) {
        if (page < 1 || limit < 1) {
          throw new Error("Page and limit must be positive numbers");
        }

        const skip = (page - 1) * limit;
        const appointments = await AppointmentModel.find(query)
          .sort({ addedToRegularAt: -1 })
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
        .sort({ addedToRegularAt: -1 })
        .lean();

      return {
        appointments,
        total,
        totalPages: Math.ceil(total / 10) || 1,
      };
    } catch (err: unknown) {
      throw new Error("Something went wrong with regular students search", {
        cause: err,
      });
    }
  }

  async getRegularTeachersByStudent(
    studentId: string,
    page?: number,
    limit?: number,
  ): Promise<{
    appointments: WithId<AppointmentTypeDB>[];
    total: number;
    totalPages: number;
  }> {
    try {
      const query = {
        studentId,
        isRegularStudent: true,
      };
      const total = await AppointmentModel.countDocuments(query);

      if (page !== undefined && limit !== undefined) {
        if (page < 1 || limit < 1) {
          throw new Error("Page and limit must be positive numbers");
        }

        const skip = (page - 1) * limit;
        const appointments = await AppointmentModel.find(query)
          .sort({ addedToRegularAt: -1 })
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
        .sort({ addedToRegularAt: -1 })
        .lean();

      return {
        appointments,
        total,
        totalPages: Math.ceil(total / 10) || 1,
      };
    } catch (err: unknown) {
      throw new Error("Something went wrong with regular teachers search", {
        cause: err,
      });
    }
  }
}
