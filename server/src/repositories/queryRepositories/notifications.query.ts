import { NotificationModel } from "../../db/schemes/notification.schema.js";
import { injectable } from "inversify";

@injectable()
export class NotificationQuery {
  async getNotificationsByUser(userId: string, limit = 30) {
    return NotificationModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }
}
