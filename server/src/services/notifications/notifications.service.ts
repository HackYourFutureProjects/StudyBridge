import { inject, injectable } from "inversify";
import { TYPES } from "../../composition/composition.types.js";
import { NotificationCommand } from "../../repositories/commandRepositories/notifications.command.js";
import { NotificationQuery } from "../../repositories/queryRepositories/notifications.query.js";
import { CreateNotificationInput } from "../../types/notifications/notifications.types.js";

@injectable()
export class NotificationService {
  constructor(
    @inject(TYPES.NotificationCommand)
    private notificationCommand: NotificationCommand,
    @inject(TYPES.NotificationQuery)
    private notificationQuery: NotificationQuery,
  ) {}

  async createNotification(payload: CreateNotificationInput) {
    return this.notificationCommand.createNotification(payload);
  }

  async getMyNotifications(userId: string) {
    return this.notificationQuery.getNotificationsByUser(userId);
  }

  async markAllAsRead(userId: string) {
    return this.notificationCommand.markAllAsRead(userId);
  }

  async markOneAsRead(notificationId: string, userId: string) {
    return this.notificationCommand.markOneAsRead(notificationId, userId);
  }

  async deleteAllRead(userId: string) {
    return this.notificationCommand.deleteAllRead(userId);
  }
}
