import mongoose from "mongoose";
import { WithId } from "mongodb";
import { ModeratorTypeDB } from "./types/moderator.types.js";

export const ModeratorSchema = new mongoose.Schema<ModeratorTypeDB>(
  {
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    passwordHash: { type: String, required: false, default: null },
    passwordSalt: { type: String, required: false, default: null },
    profileImageUrl: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    role: { type: String, required: true },
  },
  {
    versionKey: false,
  },
);

export const ModeratorModel = mongoose.model<WithId<ModeratorTypeDB>>(
  "moderator",
  ModeratorSchema,
);
