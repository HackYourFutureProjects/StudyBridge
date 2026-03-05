import mongoose from "mongoose";
import { WithId } from "mongodb";
import { StudentTypeDB } from "./types/student.types.js";

export const StudentSchema = new mongoose.Schema<StudentTypeDB>(
  {
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    phoneNumber: { type: String, default: null },
    passwordHash: { type: String, required: false, default: null },
    passwordSalt: { type: String, required: false, default: null },
    passwordReset: {
      tokenHash: { type: String, default: null },
      expiresAt: { type: Date, default: null },
    },
    profileImageUrl: { type: String, default: null },
    address: { type: String, default: null },
    mainLanguage: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    role: { type: String, required: true },
    authProvider: { type: String, required: true, default: "local" },
    googleSub: { type: String, required: false, default: null },
  },
  {
    versionKey: false,
  },
);

StudentSchema.index(
  { "passwordReset.tokenHash": 1 },
  {
    // Partial index: only index docs where reset token exists (string), to keep index small and speed token lookup.
    partialFilterExpression: {
      "passwordReset.tokenHash": { $type: "string" },
    },
  },
);

export const StudentModel = mongoose.model<WithId<StudentTypeDB>>(
  "student",
  StudentSchema,
);
