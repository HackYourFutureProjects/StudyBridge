export type TextValidationResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

export function validateChatText(
  input: unknown,
  opts?: { maxLen?: number },
): TextValidationResult {
  const maxLen = opts?.maxLen ?? 2000;

  if (typeof input !== "string") {
    return { ok: false, error: "Text must be string" };
  }

  const value = input.trim();

  if (!value) {
    return { ok: false, error: "Text required." };
  }

  if (value.length > maxLen) {
    return { ok: false, error: `Text should be shorter than ${maxLen}` };
  }

  return { ok: true, value };
}
