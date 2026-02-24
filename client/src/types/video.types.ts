export type VideoCallStatus =
  | "ringing"
  | "accepted"
  | "declined"
  | "ended"
  | "missed";

export type StartCallRequest = {
  teacherId: string;
  studentId: string;
  appointmentId?: string | null;
  streamCallType?: string;
  streamCallId: string;
};

export type VideoCallResponse = {
  id: string;
  teacherId: string;
  studentId: string;
  appointmentId?: string | null;
  streamCallType: string;
  streamCallId: string;
  status: VideoCallStatus;
  expiresAt: string;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StreamTokenResponse = {
  token: string;
  apiKey: string;
  userId: string;
  role: "teacher" | "student";
};
