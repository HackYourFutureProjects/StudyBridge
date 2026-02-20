import { Schema, model, type InferSchemaType } from "mongoose";

const lastMessageSchema = new Schema(
  {
    text: { type: String, required: true },
    senderId: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  { _id: false },
);

export const ConversationSchema = new Schema(
  {
    participantIds: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => Array.isArray(arr) && arr.length === 2,
        message: "participantIds must contain exactly 2 ids",
      },
      index: true,
    },

    appointmentId: { type: String, required: true },

    appointmentStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
      default: "pending",
      index: true,
    },

    lastMessage: { type: lastMessageSchema, required: false },
    lastMessageAt: { type: Date, required: false, index: true },
  },
  { timestamps: true, versionKey: false },
);

ConversationSchema.index({ appointmentId: 1 }, { unique: true });

ConversationSchema.index({
  participantIds: 1,
  lastMessageAt: -1,
  updatedAt: -1,
});

export type ConversationTypeDB = InferSchemaType<typeof ConversationSchema>;
export const ConversationModel = model("conversation", ConversationSchema);
