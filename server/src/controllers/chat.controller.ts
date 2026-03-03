import { TYPES } from "../composition/composition.types.js";
import { inject, injectable } from "inversify";
import { ChatQuery } from "../repositories/queryRepositories/chat.query.js";
import { Request, NextFunction, Response } from "express";
import { RequestWithParams } from "../types/common.types.js";
import { ChatService } from "../services/chat/chat.service.js";

@injectable()
export class ChatController {
  constructor(
    @inject(TYPES.ChatQuery) private chatQuery: ChatQuery,
    @inject(TYPES.ChatService) private chatService: ChatService,
  ) {}

  async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = req.auth!;
      const items = await this.chatService.getConversationList({
        userId,
        role,
      });

      return res.status(200).send(items);
    } catch (e) {
      next(e);
      return;
    }
  }

  async getMessages(
    req: RequestWithParams<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req.auth!;
      const conversationId = req.params.id;

      const can = await this.chatService.canAccessConversation(
        userId,
        conversationId,
      );
      if (!can) {
        return res.sendStatus(403);
      }

      const messages = await this.chatQuery.getMessages(conversationId, 50);
      return res.status(200).send(messages);
    } catch (e) {
      next(e);
      return;
    }
  }
}
