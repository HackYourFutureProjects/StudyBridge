import { inject, injectable } from "inversify";
import { TYPES } from "../../composition/composition.types.js";
import { ChatCommand } from "../../repositories/commandRepositories/chat.command.js";
import { ChatQuery } from "../../repositories/queryRepositories/chat.query.js";
import { HttpError } from "../../utils/error.util.js";
import { StudentQuery } from "../../repositories/queryRepositories/student.query.js";
import { TeacherQuery } from "../../repositories/queryRepositories/teacher.query.js";
import { ConversationListItemDTO } from "../../types/chat/chat.types.js";
import { mapPeer } from "../../utils/mappers/peer.mapper.js";
import { ConversationCommand } from "../../repositories/commandRepositories/conversation.command.js";

@injectable()
export class ChatService {
  constructor(
    @inject(TYPES.ChatQuery) private chatQuery: ChatQuery,
    @inject(TYPES.ChatCommand) private chatCommand: ChatCommand,
    @inject(TYPES.StudentQuery) private studentQuery: StudentQuery,
    @inject(TYPES.TeacherQuery) private teacherQuery: TeacherQuery,
    @inject(TYPES.ConversationCommand)
    private conversationCommand: ConversationCommand,
  ) {}

  async canAccessConversation(userId: string, conversationId: string) {
    const conv = await this.chatQuery.getConversationById(conversationId);
    if (!conv) {
      throw new HttpError(404, "Conversation not found");
    }

    const isParticipant = conv.participantIds.includes(userId);
    if (!isParticipant) {
      return false;
    }

    return conv.appointmentStatus === "approved";
  }

  async sendMessage(args: {
    conversationId: string;
    senderId: string;
    senderRole: "student" | "teacher";
    text: string;
  }) {
    const can = await this.canAccessConversation(
      args.senderId,
      args.conversationId,
    );

    if (!can) {
      throw new HttpError(403, "Access denied");
    }

    const message = await this.chatCommand.createMessage({
      conversationId: args.conversationId,
      senderId: args.senderId,
      text: args.text,
    });

    const conversationUpdate = await this.conversationCommand.applyNewMessage({
      conversationId: args.conversationId,
      senderId: args.senderId,
      text: message.text,
      createdAt: new Date(message.createdAt),
    });

    let senderProfile: {
      id: string;
      firstName?: string;
      lastName?: string;
      profileImageUrl?: string | null;
    } | null = null;

    if (args.senderRole === "student") {
      senderProfile = await this.studentQuery.getStudentById(args.senderId);
    } else {
      senderProfile = await this.teacherQuery.getTeacherById(args.senderId);
    }

    return {
      message,
      recipientId: conversationUpdate.recipientId,
      unreadCount: conversationUpdate.unreadCount,
      sender: {
        id: args.senderId,
        name: senderProfile
          ? `${senderProfile.firstName ?? ""} ${senderProfile.lastName ?? ""}`.trim()
          : "Unknown user",
        imageUrl: senderProfile?.profileImageUrl ?? null,
      },
    };
  }

  async markConversationAsRead(conversationId: string, userId: string) {
    const can = await this.canAccessConversation(userId, conversationId);

    if (!can) {
      throw new HttpError(403, "Access denied");
    }

    return this.conversationCommand.markAsRead(conversationId, userId);
  }

  async getConversationList(args: {
    userId: string;
    role: "student" | "teacher" | "moderator";
  }): Promise<ConversationListItemDTO[]> {
    const { userId, role } = args;

    const conversations = await this.chatQuery.getConversationsForUser(userId);

    const peerIds = Array.from(
      new Set(
        conversations
          .map((conversation) =>
            conversation.participantIds.find((id) => id !== userId),
          )
          .filter((x): x is string => Boolean(x)),
      ),
    );
    const peers =
      role === "student"
        ? await this.teacherQuery.getTeachersByIds(peerIds)
        : await this.studentQuery.getStudentsByIds(peerIds);

    const peerMap = new Map(peers.map((peer) => [peer.id, peer] as const));

    return conversations.map((conversation) => {
      const peerId = conversation.participantIds.find((id) => id !== userId);
      if (!peerId) {
        throw new HttpError(500, "Invalid conversation participants");
      }

      const peer = peerMap.get(peerId) ?? null;

      return {
        id: conversation.id,
        peer: mapPeer(peerId, peer),
        unreadCount: conversation.unreadCount,
        lastMessage: conversation.lastMessage,
        updatedAt: conversation.updatedAt,
        lastMessageAt: conversation.lastMessageAt,
      };
    });
  }
}
