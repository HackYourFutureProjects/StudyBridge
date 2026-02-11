import { injectable } from "inversify";
import { AppointmentModel } from "../../db/schemes/appointmentSchema.js";
import { AppointmentTypeDB } from "../../db/schemes/types/appointment.types.js";
import { WithId } from "mongodb";

@injectable()
export class AppointmentCommand {
  async createAppointment(
    data: AppointmentTypeDB,
  ): Promise<WithId<AppointmentTypeDB>> {
    const appointment = new AppointmentModel(data);
    return await appointment.save();
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
