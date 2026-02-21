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

    return await Promise.all(
      conversations.map(async (c) => {
        const peerId = c.participantIds.find((id) => id !== userId);
        if (!peerId) {
          throw new HttpError(500, "Invalid conversation participants");
        }

        const peer =
          role === "student"
            ? await this.teacherQuery.getTeacherById(peerId)
            : await this.studentQuery.getStudentById(peerId);

        return {
          id: c.id,
          peer: mapPeer(peerId, peer),
          lastMessage: c.lastMessage,
          updatedAt: c.updatedAt,
          lastMessageAt: c.lastMessageAt,
        };
      }),
    );
  }
}
