import mongoose from "mongoose";
import { TeacherTypeDB } from "./types/teacher.types.js";
import { WithId } from "mongodb";

const TimeSlotSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
});

export const TeacherSchema = new mongoose.Schema<TeacherTypeDB>(
  {
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    passwordHash: { type: String, required: false, default: null },
    passwordSalt: { type: String, required: false, default: null },
    passwordReset: {
      tokenHash: { type: String, default: null },
      expiresAt: { type: Date, default: null },
    },
    profileImageUrl: { type: String, default: null },
    priceFrom: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    bio: { type: String, default: null },
    headline: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    gender: { type: String, default: null },

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
          description: { type: String, default: null },
          levels: {
            type: [
              {
                level: { type: String, required: true },
                price: { type: Number, required: true, min: 0 },
              },
            ],
            required: true,
            default: [],
          },
          experienceYears: { type: Number, required: true, min: 0 },
          hourlyRate: { type: Number, required: true, min: 0 },
        },
      ],
      default: [],
    },

    timezone: { type: String, required: true, default: "Europe/Amsterdam" },

    availability: {
      monday: { type: [TimeSlotSchema], default: [] },
      tuesday: { type: [TimeSlotSchema], default: [] },
      wednesday: { type: [TimeSlotSchema], default: [] },
      thursday: { type: [TimeSlotSchema], default: [] },
      friday: { type: [TimeSlotSchema], default: [] },
      saturday: { type: [TimeSlotSchema], default: [] },
      sunday: { type: [TimeSlotSchema], default: [] },
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
    authProvider: { type: String, required: true, default: "local" },
    googleSub: { type: String, required: false, default: null },
  },
  {
    versionKey: false,
  },
);

TeacherSchema.index(
  { "passwordReset.tokenHash": 1 },
  {
    partialFilterExpression: {
      "passwordReset.tokenHash": { $type: "string" },
    },
  },
);

export const TeacherModel = mongoose.model<WithId<TeacherTypeDB>>(
  "teacher",
  TeacherSchema,
);
