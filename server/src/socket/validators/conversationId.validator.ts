import { Types } from "mongoose";

export type ValidationResult = { ok: true } | { ok: false; error: string };

export function validateConversationId(id: unknown): ValidationResult {
  if (typeof id !== "string") {
    return { ok: false, error: "ConversationId must be a string" };
  }

  const trimmed = id.trim();
  if (!trimmed) {
    return { ok: false, error: "ConversationId is required" };
  }

  if (!Types.ObjectId.isValid(trimmed)) {
    return { ok: false, error: "Invalid conversation ID" };
  }

  return { ok: true };
}
