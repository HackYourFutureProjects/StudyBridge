export type RefreshSessionDB = {
  id: string;
  userId: string;
  role: "teacher" | "student";
  refreshTokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt: Date | null;
  replacedBySessionId: string | null;
};
