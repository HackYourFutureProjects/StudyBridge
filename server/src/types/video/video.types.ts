export type VideoCallStatus =
  | "ringing"
  | "accepted"
  | "declined"
  | "ended"
  | "missed";

export type VideoCallViewType = {
  id: string;
  teacherId: string;
  studentId: string;
  appointmentId?: string | null;
  streamCallType: string;
  streamCallId: string;
  status: VideoCallStatus;
  expiresAt: Date;
  startedAt: Date | null;
  endedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateVideoCallType = {
  teacherId: string;
  studentId: string;
  appointmentId?: string | null;
  streamCallType?: string;
  streamCallId: string;
  expiresAt: Date;
};

export type UpdateVideoCallStatusType = {
  status: VideoCallStatus;
};

export type StartVideoCallInput = CreateVideoCallType & {
  authUserId: string;
  authRole: "teacher" | "student";
};
