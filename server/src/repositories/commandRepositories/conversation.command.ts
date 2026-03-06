import { ConversationModel } from "../../db/schemes/conversation.schema.js";
import { injectable } from "inversify";

@injectable()
export class ConversationCommand {
  async upsertForAppointment(args: {
    studentId: string;
    teacherId: string;
    status: "pending" | "approved" | "rejected";
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
      .select("studentId teacherId unreadCount")
      .lean();

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const isStudentSender = args.senderId === conversation.studentId;
    const recipientId = isStudentSender
      ? conversation.teacherId
      : conversation.studentId;

    const unreadField = isStudentSender
      ? "unreadCount.teacher"
      : "unreadCount.student";

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
        $inc: {
          [unreadField]: 1,
        },
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
      .select("studentId teacherId unreadCount")
      .lean();

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    let unreadField: "unreadCount.student" | "unreadCount.teacher";

    if (userId === conversation.studentId) {
      unreadField = "unreadCount.student";
    } else if (userId === conversation.teacherId) {
      unreadField = "unreadCount.teacher";
    } else {
      throw new Error("Access denied");
    }

    await ConversationModel.updateOne(
      { _id: conversationId },
      {
        $set: {
          [unreadField]: 0,
          updatedAt: new Date(),
        },
      },
    ).exec();

    const updatedConversation = await ConversationModel.findById(conversationId)
      .select("studentId teacherId unreadCount")
      .lean();

    if (!updatedConversation) {
      throw new Error("Conversation not found after markAsRead");
    }

    return {
      studentId: updatedConversation.studentId,
      teacherId: updatedConversation.teacherId,
      unreadCount: updatedConversation.unreadCount,
    };
  }
}
