export type CreateNotificationInput =
  | {
      userId: string;
      type: "chatMessages";
      conversationId: string;
      sender: {
        id: string;
        name: string;
        imageUrl: string | null;
      };
      message: {
        id: string;
        text: string;
        senderId: string;
        createdAt: string;
      };
    }
  | {
      userId: string;
      type: "appointmentStatus";
      appointmentId: string;
      status: "approved" | "rejected";
      actor: {
        id: string;
        name: string;
        imageUrl: string | null;
      };
      lesson: string;
      date: string;
      time: string;
    };
