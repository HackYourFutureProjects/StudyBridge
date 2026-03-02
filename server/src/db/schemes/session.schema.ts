import mongoose from "mongoose";
import { RefreshSessionDB } from "./types/session.types.js";

const RefreshSessionSchema = new mongoose.Schema<RefreshSessionDB>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    role: {
      type: String,
      required: true,
      enum: ["teacher", "student", "moderator"],
    },
    refreshTokenHash: { type: String, required: true },

    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },

    revokedAt: { type: Date, default: null },
    replacedBySessionId: { type: String, default: null },
  },
  { versionKey: false },
);
RefreshSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshSessionModel =
  mongoose.models.RefreshSession ||
  mongoose.model<RefreshSessionDB>("RefreshSession", RefreshSessionSchema);
