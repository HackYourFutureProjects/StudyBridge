import mongoose, { InferSchemaType } from "mongoose";
import { TeacherTypeDB } from "./types/teacher.types.js";

export const TeacherSchema = new mongoose.Schema<TeacherTypeDB>(
  {
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    priceFrom: { type: Number, required: true },
    experience: { type: Number, default: 0 },
    bio: { type: String, default: null },
    headline: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    gender: { type: String, default: null },
    rating: { type: Number, default: 0 },
    mainLanguage: { type: String, default: null },
    education: {
      type: [
        {
          degree: { type: String, required: true },
          institution: { type: String, required: true },
        },
      ],
      default: [],
    },

    subjects: {
      type: [
        {
          subjectName: { type: String, required: true },
          levels: { type: [String], required: true, default: [] },
          experienceYears: { type: Number, required: true, min: 0 },
          hourlyRate: { type: Number, required: true, min: 0 },
        },
      ],
      default: [],
    },

    availability: {
      monday: { type: [{ start: String, end: String }], default: [] },
      tuesday: { type: [{ start: String, end: String }], default: [] },
      wednesday: { type: [{ start: String, end: String }], default: [] },
      thursday: { type: [{ start: String, end: String }], default: [] },
      friday: { type: [{ start: String, end: String }], default: [] },
      saturday: { type: [{ start: String, end: String }], default: [] },
      sunday: { type: [{ start: String, end: String }], default: [] },
    },

    address: {
      street: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      zipCode: { type: String, default: null },
      country: { type: String, default: null },
    },

    createdAt: { type: Date, default: Date.now },
    role: { type: String, required: true },
  },
  {
    versionKey: false,
  },
);

export type TeacherSchemaType = InferSchemaType<typeof TeacherSchema>;
export const TeacherModel = mongoose.model<TeacherSchemaType>(
  "teacher",
  TeacherSchema,
);
