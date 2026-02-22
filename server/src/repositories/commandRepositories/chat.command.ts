import { injectable } from "inversify";
import type { ChatMessageDTO } from "../../socket/chat.socket.types.js";
import { MessageModel } from "../../db/schemes/message.schema.js";
import { Types } from "mongoose";
import { ConversationModel } from "../../db/schemes/conversation.schema.js";
import { logError } from "../../utils/logging.js";

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

    try {
      await this.updateConversationLastMessage(args.conversationId, {
        text: doc.text,
        senderId: doc.senderId,
        createdAt: doc.createdAt.toISOString(),
      });
    } catch (error) {
      logError(error);
    }

    return {
      id: doc._id.toString(),
      conversationId: doc.conversationId,
      senderId: doc.senderId,
      text: doc.text,
      createdAt: doc.createdAt.toISOString(),
    };
  }

  async updateConversationLastMessage(
    conversationId: string,
    lastMessage: { text: string; senderId: string; createdAt: string },
  ): Promise<void> {
    if (!Types.ObjectId.isValid(conversationId)) {
      throw new Error("Invalid conversation id");
    }

    const createdAtDate = new Date(lastMessage.createdAt);
    if (Number.isNaN(createdAtDate.getTime())) {
      throw new Error("Invalid conversation id");
    }

    await ConversationModel.updateOne(
      { _id: conversationId },
      {
        $set: {
          lastMessage: {
            text: lastMessage.text,
            senderId: lastMessage.senderId,
            createdAt: createdAtDate,
          },
          lastMessageAt: createdAtDate,
        },
      },
    ).exec();
  }
}
