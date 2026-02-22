import { ConversationModel } from "../../db/schemes/conversation.schema.js";
import { injectable } from "inversify";

@injectable()
export class ConversationCommand {
  async upsertForAppointment(args: {
    appointmentId: string;
    studentId: string;
    teacherId: string;
    status: "pending" | "approved" | "rejected";
  }) {
    const participantIds = [args.studentId, args.teacherId].sort();

    const updated = await ConversationModel.updateOne(
      { appointmentId: args.appointmentId },
      {
        $setOnInsert: {
          participantIds,
          appointmentId: args.appointmentId,
        },
        $set: {
          appointmentStatus: args.status,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    ).exec();

    return updated.acknowledged;
  }
}
