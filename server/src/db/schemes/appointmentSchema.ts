import mongoose from "mongoose";
import { AppointmentTypeDB } from "./types/appointment.types.js";
import { WithId } from "mongodb";

export const AppointmentSchema = new mongoose.Schema<AppointmentTypeDB>(
  {
    id: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, index: true },
    teacherId: { type: String, required: true, index: true },
    lesson: { type: String, required: true },
    teacher: { type: String, required: true },
    student: { type: String, required: true },
    price: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    videoCall: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const AppointmentModel = mongoose.model<WithId<AppointmentTypeDB>>(
  "appointment",
  AppointmentSchema,
);
