export type Role = "student" | "teacher";

export type ChatUser = {
  id: string;
  role: Role;
  name: string;
  imageUrl: string | null;
};

export type Conversation = {
  id: string;
  participantIds: [string, string];
  peerId: string;
  lastMessage?: {
    text: string;
    createdAt: string;
    senderId: string;
  };
  updatedAt: string;
  appointmentStatus: "accepted";
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
};

export const mockCurrentUser: ChatUser = {
  id: "student-1",
  role: "student",
  name: "Alex Student",
  imageUrl: null,
};

export const chatPeopleList: ChatUser[] = [
  {
    id: "teacher-1",
    role: "teacher",
    name: "Nataly Chaplack",
    imageUrl: null,
  },
  {
    id: "teacher-2",
    role: "teacher",
    name: "Shchastislav Yurchuk",
    imageUrl: null,
  },
  {
    id: "teacher-3",
    role: "teacher",
    name: "Apanovych Lubomudr",
    imageUrl: null,
  },
];

export const mockConversations: Conversation[] = chatPeopleList.map(
  (peer, i) => {
    const convId = `conv-${100 + i + 1}`;
    const updatedAt =
      i === 0
        ? "2026-02-18T10:20:00.000Z"
        : i === 1
          ? "2026-02-17T19:05:00.000Z"
          : "2026-02-16T08:10:00.000Z";

    const lastMessage =
      i === 0
        ? {
            text: "Great, see you at 10:00!",
            createdAt: "2026-02-18T10:20:00.000Z",
            senderId: peer.id,
          }
        : i === 1
          ? {
              text: "Please send me your current level.",
              createdAt: "2026-02-17T19:05:00.000Z",
              senderId: peer.id,
            }
          : {
              text: "Hi! How can I help you?",
              createdAt: "2026-02-16T08:10:00.000Z",
              senderId: peer.id,
            };

    return {
      id: convId,
      participantIds: [mockCurrentUser.id, peer.id],
      peerId: peer.id,
      lastMessage,
      updatedAt,
      appointmentStatus: "accepted",
    };
  },
);

export const mockMessages: Message[] = [
  {
    id: "m-1",
    conversationId: "conv-101",
    senderId: mockCurrentUser.id,
    text: "Hi! I booked 10:00. Is it ok?",
    createdAt: "2026-02-18T10:00:00.000Z",
  },
  {
    id: "m-2",
    conversationId: "conv-101",
    senderId: "teacher-1",
    text: "Yes, perfect.",
    createdAt: "2026-02-18T10:10:00.000Z",
  },
  {
    id: "m-3",
    conversationId: "conv-101",
    senderId: "teacher-1",
    text: "Great, see you at 10:00!",
    createdAt: "2026-02-18T10:20:00.000Z",
  },
  {
    id: "m-14",
    conversationId: "conv-101",
    senderId: "teacher-1",
    text: "Great, see you at 10:00!",
    createdAt: "2026-02-18T10:20:00.000Z",
  },
  {
    id: "m-15",
    conversationId: "conv-101",
    senderId: "teacher-1",
    text: "Great, see you at 10:00!",
    createdAt: "2026-02-18T10:20:00.000Z",
  },
  {
    id: "m-16",
    conversationId: "conv-101",
    senderId: "teacher-1",
    text: "Great, see you at 10:00!",
    createdAt: "2026-02-18T10:20:00.000Z",
  },
  {
    id: "m-17",
    conversationId: "conv-101",
    senderId: "teacher-1",
    text: "Great, see you at 10:00!",
    createdAt: "2026-02-18T10:20:00.000Z",
  },
  {
    id: "m-18",
    conversationId: "conv-101",
    senderId: "teacher-1",
    text: "Great, see you at 10:00!",
    createdAt: "2026-02-18T10:20:00.000Z",
  },
  {
    id: "m-19",
    conversationId: "conv-101",
    senderId: "teacher-1",
    text: "Great, see you at 10:00!",
    createdAt: "2026-02-18T10:20:00.000Z",
  },
  {
    id: "m-20",
    conversationId: "conv-101",
    senderId: "teacher-1",
    text: "Great, see you at 10:00!",
    createdAt: "2026-02-18T10:20:00.000Z",
  },
  {
    id: "m-4",
    conversationId: "conv-102",
    senderId: "teacher-2",
    text: "Please send me your current level.",
    createdAt: "2026-02-17T19:05:00.000Z",
  },
  {
    id: "m-5",
    conversationId: "conv-102",
    senderId: mockCurrentUser.id,
    text: "I'm around B1, want to reach B2.",
    createdAt: "2026-02-17T19:06:00.000Z",
  },

  {
    id: "m-6",
    conversationId: "conv-103",
    senderId: "teacher-3",
    text: "Hi! How can I help you?",
    createdAt: "2026-02-16T08:10:00.000Z",
  },
];
