import { Role } from "../../../types/common.types.js";
export type RefreshSessionDB = {
  id: string;
  userId: string;
  role: Role;
  refreshTokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt: Date | null;
  replacedBySessionId: string | null;
};
export type RefreshSessionPatch = Partial<
  Omit<RefreshSessionDB, "id" | "createdAt">
>;
