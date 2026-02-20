import { StudentViewType } from "../student/student.types.js";
import { TeacherViewType } from "../teacher/teacher.types.js";

type PeerView = StudentViewType | TeacherViewType;

export type PeerMinimal = Pick<
  PeerView,
  "id" | "firstName" | "lastName" | "email" | "profileImageUrl"
>;

export type ConversationListItemDTO = {
  id: string;
  peer: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
  lastMessage?: { text: string; senderId: string; createdAt: string };
  updatedAt: string;
  lastMessageAt?: string;
};
