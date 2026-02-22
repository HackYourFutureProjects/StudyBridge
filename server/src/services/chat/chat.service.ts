import { inject, injectable } from "inversify";
import { TYPES } from "../../composition/composition.types.js";
import { ChatMessageDTO } from "../../socket/chat.socket.types.js";
import { ChatCommand } from "../../repositories/commandRepositories/chat.command.js";
import { ChatQuery } from "../../repositories/queryRepositories/chat.query.js";
import { HttpError } from "../../utils/error.util.js";
import { StudentQuery } from "../../repositories/queryRepositories/student.query.js";
import { TeacherQuery } from "../../repositories/queryRepositories/teacher.query.js";
import { ConversationListItemDTO } from "../../types/chat/chat.types.js";
import { mapPeer } from "../../utils/mappers/peer.mapper.js";

@injectable()
export class ChatService {
  constructor(
    @inject(TYPES.ChatQuery) private chatQuery: ChatQuery,
    @inject(TYPES.ChatCommand) private chatCommand: ChatCommand,
    @inject(TYPES.StudentQuery) private studentQuery: StudentQuery,
    @inject(TYPES.TeacherQuery) private teacherQuery: TeacherQuery,
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
    text: string;
  }): Promise<ChatMessageDTO> {
    const can = await this.canAccessConversation(
      args.senderId,
      args.conversationId,
    );

    if (!can) {
      throw new HttpError(403, "Forbidden");
    }

    return this.chatCommand.createMessage(args);
  }

  async getConversationList(args: {
    userId: string;
    role: "student" | "teacher";
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
        lastMessage: conversation.lastMessage,
        updatedAt: conversation.updatedAt,
        lastMessageAt: conversation.lastMessageAt,
      };
    });
  }
}
