import mongoose from "mongoose";
import { WithId } from "mongodb";
import { StudentTypeDB } from "./types/student.types.js";

export const StudentSchema = new mongoose.Schema<WithId<StudentTypeDB>>({
  id: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  passwordSalt: { type: String, required: true },
  address: { type: String, required: true },
  mainLanguage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, required: true },
});

export const StudentModel = mongoose.model<WithId<StudentTypeDB>>(
  "student",
  StudentSchema,
);
