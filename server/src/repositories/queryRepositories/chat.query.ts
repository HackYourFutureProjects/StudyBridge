import { injectable } from "inversify";
import { Types } from "mongoose";
import { ConversationModel } from "../../db/schemes/conversation.schema.js";
import { MessageModel } from "../../db/schemes/message.schema.js";
import {
  ConversationListItemDB,
  MessageDB,
} from "../../db/schemes/types/chat.types.js";

@injectable()
export class ChatQuery {
  async getConversationById(conversationId: string) {
    if (!Types.ObjectId.isValid(conversationId)) {
      return null;
    }
    const doc = await ConversationModel.findById(conversationId).lean();
    if (!doc) {
      return null;
    }

    return {
      id: doc._id.toString(),
      participantIds: doc.participantIds,
      appointmentStatus: doc.appointmentStatus,
    };
  }

  async getConversationsForUser(
    userId: string,
  ): Promise<ConversationListItemDB[]> {
    const docs = await ConversationModel.find({
      participantIds: userId,
      appointmentStatus: "approved",
    })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .lean();

    return docs.map((d) => ({
      id: d._id.toString(),
      participantIds: d.participantIds as [string, string],
      appointmentStatus: d.appointmentStatus,
      lastMessage: d.lastMessage
        ? {
            text: d.lastMessage.text,
            senderId: d.lastMessage.senderId,
            createdAt: d.lastMessage.createdAt.toISOString(),
          }
        : undefined,
      updatedAt: d.updatedAt.toISOString(),
      lastMessageAt: d.lastMessageAt
        ? d.lastMessageAt.toISOString()
        : undefined,
    }));
  }

  async getMessages(conversationId: string, limit = 50): Promise<MessageDB[]> {
    if (!Types.ObjectId.isValid(conversationId)) {
      return [];
    }

    const docs = await MessageModel.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(limit)
      .lean();

    return docs.map((m) => ({
      id: m._id.toString(),
      conversationId: m.conversationId,
      senderId: m.senderId,
      text: m.text,
      createdAt: m.createdAt.toISOString(),
    }));
  }
}
