import { Schema, model, type InferSchemaType } from "mongoose";

const personSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    imageUrl: { type: String, default: null },
  },
  { _id: false },
);

const messageSchema = new Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    senderId: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { _id: false },
);

export const NotificationSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },

    type: {
      type: String,
      enum: ["chatMessages", "appointmentStatus"],
      required: true,
    },

    isRead: { type: Boolean, required: true, default: false },
    createdAt: { type: String, required: true },

    conversationId: { type: String },
    sender: { type: personSchema },
    message: { type: messageSchema },

    appointmentId: { type: String },
    status: { type: String, enum: ["approved", "rejected"] },
    actor: { type: personSchema },
    lesson: { type: String },
    date: { type: String },
    time: { type: String },
  },
  { versionKey: false },
);

NotificationSchema.index({ userId: 1, createdAt: -1 });

export type NotificationTypeDB = InferSchemaType<typeof NotificationSchema>;
export const NotificationModel = model("notification", NotificationSchema);
