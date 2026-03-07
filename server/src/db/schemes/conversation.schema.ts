import { Schema, model, type InferSchemaType } from "mongoose";

const lastMessageSchema = new Schema(
  {
    text: { type: String, required: true },
    senderId: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  { _id: false },
);

const unreadCountSchema = new Schema(
  {
    student: { type: Number, required: true, default: 0 },
    teacher: { type: Number, required: true, default: 0 },
  },
  { _id: false },
);

export const ConversationSchema = new Schema(
  {
    studentId: { type: String, required: true, index: true },
    teacherId: { type: String, required: true, index: true },

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
      sparse: true,
    },

    appointmentStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
      default: "pending",
      index: true,
    },

    unreadCount: {
      type: unreadCountSchema,
      required: true,
      default: () => ({
        student: 0,
        teacher: 0,
      }),
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

export type ConversationTypeDB = InferSchemaType<typeof ConversationSchema>;
export const ConversationModel = model("conversation", ConversationSchema);
