import { injectable } from "inversify";
import type { ChatMessageDTO } from "../../socket/chat.socket.types.js";
import { MessageModel } from "../../db/schemes/message.schema.js";
import { Types } from "mongoose";

@injectable()
export class ChatCommand {
  async createMessage(args: {
    conversationId: string;
    senderId: string;
    text: string;
  }): Promise<ChatMessageDTO> {
    if (!Types.ObjectId.isValid(args.conversationId)) {
      throw new Error("Invalid conversation id: " + args.conversationId);
    }

    const doc = await MessageModel.create({
      conversationId: args.conversationId,
      senderId: args.senderId,
      text: args.text,
    });

    return {
      id: doc._id.toString(),
      conversationId: doc.conversationId,
      senderId: doc.senderId,
      text: doc.text,
      createdAt: doc.createdAt.toISOString(),
    };
  }
}
