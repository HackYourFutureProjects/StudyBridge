export type VideoCallDB = {
  id: string;
  teacherId: string;
  studentId: string;
  appointmentId?: string | null;
  streamCallType: string;
  streamCallId: string;
  status: "ringing" | "accepted" | "declined" | "ended" | "missed";
  expiresAt: Date;
  startedAt: Date | null;
  endedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
