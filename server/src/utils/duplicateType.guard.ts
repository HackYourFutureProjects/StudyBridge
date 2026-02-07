type MongoDuplicateKeyError = {
  code: 11000;
  keyValue?: Record<string, unknown>;
  message?: string;
};

export const isMongoDuplicateKeyError = (
  e: unknown,
): e is MongoDuplicateKeyError => {
  if (typeof e !== "object" || e === null) {
    return false;
  }

  const obj = e as Record<string, unknown>;
  return obj["code"] === 11000;
};
