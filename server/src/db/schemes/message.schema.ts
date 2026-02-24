import { Schema, model, type InferSchemaType } from "mongoose";

const MessageSchema = new Schema(
  {
    conversationId: { type: String, required: true, index: true },
    senderId: { type: String, required: true, index: true },
    text: { type: String, required: true, trim: true },

    readAt: { type: Date, required: false },
  },
  { timestamps: true, versionKey: false },
);

MessageSchema.index({ conversationId: 1, createdAt: -1 });

export type MessageTypeDB = InferSchemaType<typeof MessageSchema>;
export const MessageModel = model("message", MessageSchema);
