import { inject, injectable } from "inversify";
import { VideoCallCommand } from "../../repositories/commandRepositories/videoCall.command.js";
import { TYPES } from "../../composition/composition.types.js";
import { VideoCallQuery } from "../../repositories/queryRepositories/videoCall.query.js";
import { HttpError } from "../../utils/error.util.js";
import { VideoCallDB } from "../../db/schemes/types/videoCall.types.js";
import { StudentModel } from "../../db/schemes/studentSchema.js";
import { TeacherModel } from "../../db/schemes/teacherSchema.js";
import { AppointmentModel } from "../../db/schemes/appointmentSchema.js";
import { VideoCallModel } from "../../db/schemes/videoCallSchema.js";
import {
  StartVideoCallInput,
  VideoCallViewType,
} from "../../types/video/video.types.js";
import { randomUUID } from "node:crypto";

@injectable()
export class VideoCallService {
  constructor(
    @inject(TYPES.VideoCallCommand) private videoCallCommand: VideoCallCommand,
    @inject(TYPES.VideoCallQuery) private videoCallQuery: VideoCallQuery,
  ) {}

  async startCall({
    teacherId,
    studentId,
    appointmentId,
    streamCallType,
    streamCallId,
    authUserId,
    authRole,
  }: StartVideoCallInput) {
    if (authRole !== "teacher")
      throw new HttpError(403, "Only teachers can start calls");

    //// Safety check: a teacher can only start a call using their own logged-in ID.
    if (authUserId !== teacherId)
      throw new HttpError(403, "You can only start calls as yourself");

    const videoAlreadyActive =
      await this.videoCallQuery.getVideoByStreamCallId(streamCallId);

    if (videoAlreadyActive) {
      throw new HttpError(409, "This call already exists");
    }

    const teacher = await TeacherModel.findOne({ id: teacherId }).lean();
    if (!teacher) throw new HttpError(404, "Teacher not found");

    const student = await StudentModel.findOne({ id: studentId }).lean();
    if (!student) throw new HttpError(404, "Student not found");

    //if appointmentId is sent, validate it exists
    if (appointmentId) {
      const appointment = await AppointmentModel.findOne({
        id: appointmentId,
      }).lean();
      if (!appointment) throw new HttpError(404, "Appointment not found");

      //if appointmentId is provided, verify that appointment belongs to the same teacherId and studentId.
      if (appointment.teacherId !== teacherId)
        throw new HttpError(
          404,
          "This appointment does not belong to this teacher",
        );

      if (appointment.studentId !== studentId)
        throw new HttpError(
          404,
          "This appointment does not belong to this student",
        );
    }

    const now = new Date();

    //prevent duplicate active ringing call
    const active = await VideoCallModel.findOne({
      teacherId,
      studentId,
      status: "ringing",
      expiresAt: { $gt: now },
    }).lean();

    if (active)
      throw new HttpError(409, "There is already an active ringing call");

    const newVideo: VideoCallDB = {
      id: randomUUID(),
      teacherId: teacherId,
      studentId: studentId,
      appointmentId: appointmentId ?? null,
      streamCallType: streamCallType ?? "default",
      streamCallId: streamCallId,
      status: "ringing",
      expiresAt: new Date(Date.now() + 60 * 1000), // if student doesn’t accept within 60s, it is considered expired/missed.
      // expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      startedAt: null,
      endedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    const call = await this.videoCallCommand.startVideoCall(newVideo);
    return call;
  }

  // Checks if the logged-in student has an active incoming ringing call right now.
  async incomingCall({
    authUserId,
    authRole,
  }: {
    authUserId: string;
    authRole: "teacher" | "student";
  }): Promise<VideoCallViewType | null> {
    if (authRole !== "student")
      throw new HttpError(403, "This endpoint is for students only");

    const incoming =
      await this.videoCallQuery.getIncomingCallForStudent(authUserId);

    // if none found, no active incoming call
    if (!incoming) return null;

    if (incoming.expiresAt <= new Date()) {
      await this.videoCallCommand.markExpiredCallAsMissed(incoming.id);
      return null;
    }

    return incoming;
  }

  async acceptCall({
    callId,
    authUserId,
    authRole,
  }: {
    callId: string;
    authUserId: string;
    authRole: "teacher" | "student";
  }): Promise<VideoCallViewType | null> {
    const now = new Date();

    if (authRole !== "student")
      throw new HttpError(403, "Students only can accept the call");

    //check if call exists
    const call = await this.videoCallQuery.getVideoById(callId);
    if (!call) throw new HttpError(404, "Call not found");

    if (call.expiresAt <= now) {
      await this.videoCallCommand.markExpiredCallAsMissed(callId);
      throw new HttpError(409, "Call has expired");
    }

    if (call.studentId !== authUserId)
      throw new HttpError(403, "Only students can accept the call");

    if (call.status !== "ringing") {
      throw new HttpError(409, "Call is no longer ringing");
    }

    const acceptedCall = await this.videoCallCommand.acceptCallById(callId);

    return acceptedCall ?? null;
  }

  async declineCall({
    callId,
    authUserId,
    authRole,
  }: {
    callId: string;
    authUserId: string;
    authRole: "teacher" | "student";
  }): Promise<VideoCallViewType | null> {
    const now = new Date();

    if (authRole !== "student")
      throw new HttpError(403, "Students only can decline the call");

    //check if call exists
    const call = await this.videoCallQuery.getVideoById(callId);
    if (!call) throw new HttpError(404, "Call not found");

    if (call.studentId !== authUserId)
      throw new HttpError(403, "Only students can decline the call");

    if (call.expiresAt <= now) {
      await this.videoCallCommand.markExpiredCallAsMissed(callId);
      throw new HttpError(409, "Call has expired");
    }

    if (call.status !== "ringing") {
      throw new HttpError(409, "Call is no longer ringing");
    }

    const declinedCall = await this.videoCallCommand.declineCallById(callId);

    return declinedCall ?? null;
  }

  async endCall({
    callId,
    authUserId,
  }: {
    callId: string;
    authUserId: string;
  }): Promise<VideoCallViewType | null> {
    const now = new Date();

    //check if call exists
    const call = await this.videoCallQuery.getVideoById(callId);
    if (!call) throw new HttpError(404, "Call not found");

    // Only teacher or student participant can end
    if (call.studentId !== authUserId && call.teacherId !== authUserId)
      throw new HttpError(403, "Only participants can end the call");

    // if still ringing but expired, mark missed
    if (call.status === "ringing" && call.expiresAt <= now) {
      await this.videoCallCommand.markExpiredCallAsMissed(callId);
      throw new HttpError(409, "Call has expired");
    }

    if (call.status !== "accepted") {
      throw new HttpError(409, "Call is no longer ongoing");
    }

    const endedCall = await this.videoCallCommand.endCallById(callId);

    return endedCall ?? null;
  }
}
