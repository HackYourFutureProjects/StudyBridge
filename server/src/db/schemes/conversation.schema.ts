import { Schema, model } from "mongoose";

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
    },

    participantsKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

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

ConversationSchema.index({
  participantIds: 1,
  lastMessageAt: -1,
  updatedAt: -1,
});

export const ConversationModel = model("conversation", ConversationSchema);
