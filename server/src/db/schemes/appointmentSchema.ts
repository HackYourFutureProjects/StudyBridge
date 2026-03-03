import mongoose from "mongoose";
import { AppointmentTypeDB } from "./types/appointment.types.js";
import { WithId } from "mongodb";

const weeklyScheduleSlotSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    hour: { type: Number, required: true },
  },
  { _id: false },
);

export const AppointmentSchema = new mongoose.Schema<AppointmentTypeDB>(
  {
    id: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, index: true },
    teacherId: { type: String, required: true, index: true },
    lesson: { type: String, required: true },
    level: { type: String, default: "" },
    teacher: { type: String, required: true },
    student: { type: String, required: true },
    price: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    videoCall: { type: String, default: null },
    isRegularStudent: { type: Boolean, default: false },
    weeklySchedule: [weeklyScheduleSlotSchema],
    addedToRegularAt: { type: Date, default: null },
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
