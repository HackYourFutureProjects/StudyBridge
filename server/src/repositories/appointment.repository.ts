import { injectable } from "inversify";
import { AppointmentModel } from "../db/schemes/appointmentSchema.js";
import { AppointmentTypeDB } from "../db/schemes/types/appointment.types.js";
import { WithId } from "mongodb";

@injectable()
export class AppointmentRepository {
  async createAppointment(
    data: AppointmentTypeDB,
  ): Promise<WithId<AppointmentTypeDB>> {
    const appointment = new AppointmentModel(data);
    return await appointment.save();
  }

  async getAppointmentById(
    id: string,
  ): Promise<WithId<AppointmentTypeDB> | null> {
    return await AppointmentModel.findOne({ id }).exec();
  }

  async getAppointmentsByStudent(
    studentId: string,
  ): Promise<WithId<AppointmentTypeDB>[]> {
    return await AppointmentModel.find({ studentId })
      .sort({ startTime: 1 })
      .exec();
  }

  async getAppointmentsByTeacher(
    teacherId: string,
  ): Promise<WithId<AppointmentTypeDB>[]> {
    return await AppointmentModel.find({ teacherId })
      .sort({ startTime: 1 })
      .exec();
  }

  async getPendingAppointmentsByTeacher(
    teacherId: string,
  ): Promise<WithId<AppointmentTypeDB>[]> {
    return await AppointmentModel.find({
      teacherId,
      status: "pending",
    })
      .sort({ startTime: 1 })
      .exec();
  }

  async updateAppointment(
    id: string,
    data: Partial<AppointmentTypeDB>,
  ): Promise<WithId<AppointmentTypeDB> | null> {
    return await AppointmentModel.findOneAndUpdate({ id }, data, {
      new: true,
    }).exec();
  }
}
