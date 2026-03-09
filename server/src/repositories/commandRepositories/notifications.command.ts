import { injectable } from "inversify";
import { NotificationModel } from "../../db/schemes/notification.schema.js";
import { randomUUID } from "node:crypto";
import { CreateNotificationInput } from "../../types/notifications/notifications.types.js";

@injectable()
export class NotificationCommand {
  async createNotification(
    data: Omit<CreateNotificationInput, "id" | "createdAt" | "isRead">,
  ) {
    const created = await NotificationModel.create({
      ...data,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      isRead: false,
    });

    return created.toObject();
  }

  async markAllAsRead(userId: string) {
    return await NotificationModel.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } },
    ).exec();
  }

  async markOneAsRead(notificationId: string, userId: string) {
    await NotificationModel.updateOne(
      { id: notificationId, userId },
      { $set: { isRead: true } },
    ).exec();
  }

  async deleteAllRead(userId: string) {
    return NotificationModel.deleteMany({
      userId,
      isRead: true,
    }).exec();
  }
}
