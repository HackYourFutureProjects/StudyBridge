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
  ): Promise<WithId<AppointmentTypeDB>[]> {
    try {
      return await AppointmentModel.find({ studentId })
        .sort({ date: 1, time: 1 })
        .lean();
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
      return await AppointmentModel.find({ teacherId })
        .sort({ date: 1, time: 1 })
        .lean();
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
}
