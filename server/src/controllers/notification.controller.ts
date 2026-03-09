import { inject, injectable } from "inversify";
import { TYPES } from "../composition/composition.types.js";
import { NextFunction, Response, Request } from "express";
import { validateAuthorization } from "../utils/validation/requestValidation.util.js";
import { RequestWithParams } from "../types/common.types.js";
import { NotificationService } from "../services/notifications/notifications.service.js";

@injectable()
export class NotificationController {
  constructor(
    @inject(TYPES.NotificationService)
    private notificationService: NotificationService,
  ) {}

  async getMyNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = validateAuthorization(req.auth?.userId);
      const items = await this.notificationService.getMyNotifications(userId);
      return res.status(200).json(items);
    } catch (error) {
      return next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = validateAuthorization(req.auth?.userId);
      await this.notificationService.markAllAsRead(userId);
      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  }

  async markOneAsRead(
    req: RequestWithParams<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = validateAuthorization(req.auth?.userId);
      await this.notificationService.markOneAsRead(req.params.id, userId);
      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  }

  async deleteAllRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = validateAuthorization(req.auth?.userId);
      await this.notificationService.deleteAllRead(userId);
      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  }
}
