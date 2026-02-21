import mongoose from "mongoose";
import { ReviewTypeDB } from "./types/review.types.js";

export const ReviewSchema = new mongoose.Schema<ReviewTypeDB>(
  {
    teacherId: { type: String, required: true, index: true },
    studentId: { type: String, required: true },
    bookingId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: false },
    subject: { type: String, required: true },
    studentName: { type: String, required: true },
    studentAvatar: { type: String, required: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

ReviewSchema.index({ teacherId: 1, createdAt: -1 });

export const ReviewModel = mongoose.model<ReviewTypeDB>("review", ReviewSchema);
