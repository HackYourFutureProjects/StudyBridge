import mongoose from "mongoose";
import { WithId } from "mongodb";
import { StudentTypeDB } from "./types/student.types.js";

export const StudentSchema = new mongoose.Schema<StudentTypeDB>(
  {
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    address: { type: String, default: null },
    mainLanguage: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    role: { type: String, required: true },
  },
  {
    versionKey: false,
  },
);

export const StudentModel = mongoose.model<WithId<StudentTypeDB>>(
  "student",
  StudentSchema,
);
