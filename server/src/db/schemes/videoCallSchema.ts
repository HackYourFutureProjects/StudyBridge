import mongoose from "mongoose";
import { VideoCallDB } from "./types/videoCall.types.js";
import { WithId } from "mongodb";

export const VideoCallSchema = new mongoose.Schema<VideoCallDB>(
  {
    id: { type: String, required: true, unique: true },
    teacherId: { type: String, required: true, index: true },
    studentId: { type: String, required: true, index: true },
    appointmentId: {
      type: String,
      required: false,
      default: null,
      index: true,
    },

    streamCallType: { type: String, required: true, default: "default" },
    streamCallId: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      required: true,
      enum: ["ringing", "accepted", "declined", "ended", "missed"],
      default: "ringing",
    },
    expiresAt: { type: Date, required: true, index: true },
    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

// helps the app quickly find active incoming calls for a student.
VideoCallSchema.index({ studentId: 1, status: 1, expiresAt: 1 });
// helps lookup and sort latest call candidates by appointment and status.
VideoCallSchema.index({ appointmentId: 1, status: 1, createdAt: -1 });
// helps filtering of non-expired calls by appointment and status
VideoCallSchema.index({ appointmentId: 1, status: 1, expiresAt: 1 });

export const VideoCallModel = mongoose.model<WithId<VideoCallDB>>(
  "videoCall",
  VideoCallSchema,
);
