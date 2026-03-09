import { AppointmentStatus } from "./appointments.types.ts";

export type AppNotification =
  | {
      type: "chatMessages";
      conversationId: string;
      message: {
        id: string;
        text: string;
        senderId: string;
        createdAt: string;
      };
    }
  | {
      type: "appointmentStatus";
      appointmentId: string;
      status: AppointmentStatus;
      teacherId: string;
      lesson: string;
      date: string;
      time: string;
    };
