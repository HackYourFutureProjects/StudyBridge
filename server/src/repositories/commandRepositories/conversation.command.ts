// server/src/repositories/commandRepositories/conversation.command.ts

import { ConversationModel } from "../../db/schemes/conversation.schema.js";
import { injectable } from "inversify";
import { HttpError } from "../../utils/error.util.js";

type AppointmentStatus = "pending" | "approved" | "rejected";

@injectable()
export class ConversationCommand {
  async upsertForAppointment(args: {
    studentId: string;
    teacherId: string;
    status: AppointmentStatus;
  }) {
    const participantIds = [args.studentId, args.teacherId].sort();
    const participantsKey = participantIds.join(":");

    const updated = await ConversationModel.updateOne(
      { participantsKey },
      {
        $setOnInsert: {
          studentId: args.studentId,
          teacherId: args.teacherId,
          participantIds,
          participantsKey,
          unreadCount: {
            student: 0,
            teacher: 0,
          },
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

  async applyNewMessage(args: {
    conversationId: string;
    senderId: string;
    text: string;
    createdAt: Date;
  }) {
    const conversation = await ConversationModel.findById(args.conversationId)
      .select("studentId teacherId participantIds unreadCount")
      .lean();

    if (!conversation) {
      throw new HttpError(404, "Conversation not found.");
    }

    const participantIds = conversation.participantIds ?? [];
    const isParticipant = participantIds.includes(args.senderId);
    if (!isParticipant) {
      throw new HttpError(403, "Access denied");
    }

    const recipientId =
      args.senderId === conversation.studentId
        ? conversation.teacherId
        : args.senderId === conversation.teacherId
          ? conversation.studentId
          : (participantIds.find((id) => id !== args.senderId) ?? null);

    if (!recipientId) {
      throw new HttpError(500, "Invalid conversation participants");
    }

    let unreadInc:
      | { "unreadCount.student": number }
      | { "unreadCount.teacher": number }
      | { "unreadCount.student": number; "unreadCount.teacher": number };

    if (args.senderId === conversation.studentId) {
      unreadInc = { "unreadCount.teacher": 1 };
    } else if (args.senderId === conversation.teacherId) {
      unreadInc = { "unreadCount.student": 1 };
    } else {
      unreadInc = { "unreadCount.student": 1, "unreadCount.teacher": 1 };
    }

    await ConversationModel.updateOne(
      { _id: args.conversationId },
      {
        $set: {
          lastMessage: {
            text: args.text,
            senderId: args.senderId,
            createdAt: args.createdAt,
          },
          lastMessageAt: args.createdAt,
          updatedAt: new Date(),
        },
        $inc: unreadInc,
      },
    ).exec();

    const updatedConversation = await ConversationModel.findById(
      args.conversationId,
    )
      .select("unreadCount")
      .lean();

    return {
      recipientId,
      unreadCount: updatedConversation?.unreadCount ?? {
        student: 0,
        teacher: 0,
      },
    };
  }

  async markAsRead(conversationId: string, userId: string) {
    const conversation = await ConversationModel.findById(conversationId)
      .select("studentId teacherId participantIds unreadCount")
      .lean();

    if (!conversation) {
      throw new HttpError(404, "Conversation not found");
    }

    const participantIds = conversation.participantIds ?? [];
    const isParticipant =
      userId === conversation.studentId ||
      userId === conversation.teacherId ||
      participantIds.includes(userId);

    if (!isParticipant) {
      throw new HttpError(403, "Access denied");
    }

    let updateSet:
      | { "unreadCount.student": 0; updatedAt: Date }
      | { "unreadCount.teacher": 0; updatedAt: Date }
      | { "unreadCount.student": 0; "unreadCount.teacher": 0; updatedAt: Date };

    if (userId === conversation.studentId) {
      updateSet = { "unreadCount.student": 0, updatedAt: new Date() };
    } else if (userId === conversation.teacherId) {
      updateSet = { "unreadCount.teacher": 0, updatedAt: new Date() };
    } else {
      updateSet = {
        "unreadCount.student": 0,
        "unreadCount.teacher": 0,
        updatedAt: new Date(),
      };
    }

    await ConversationModel.updateOne(
      { _id: conversationId },
      { $set: updateSet },
    ).exec();

    const updatedConversation = await ConversationModel.findById(conversationId)
      .select("studentId teacherId unreadCount")
      .lean();

    if (!updatedConversation) {
      throw new HttpError(404, "Conversation not found after markAsRead");
    }

    return {
      studentId: updatedConversation.studentId,
      teacherId: updatedConversation.teacherId,
      unreadCount: updatedConversation.unreadCount,
    };
  }
}
