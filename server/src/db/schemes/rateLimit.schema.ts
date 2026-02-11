import mongoose from "mongoose";
import { RateLimitTypes } from "./types/rateLimit.types.js";

const RateSchema = new mongoose.Schema<RateLimitTypes>(
  {
    ip: { type: String, required: true },
    url: { type: String, required: true },
    bucket: { type: Number, required: true },
    count: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, required: true, default: Date.now },
  },
  { versionKey: false },
);

RateSchema.index({ ip: 1, url: 1, bucket: 1 }, { unique: true });

RateSchema.index({ createdAt: 1 }, { expireAfterSeconds: 120 });

export const RateModel =
  mongoose.models.Rate || mongoose.model("Rate", RateSchema);
