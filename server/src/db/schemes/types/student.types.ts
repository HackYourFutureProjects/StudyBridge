import { UsersRole } from "../../../types/common.types.js";

export type StudentTypeDB = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash?: string | null;
  passwordSalt?: string | null;
  passwordReset: {
    tokenHash: string | null;
    expiresAt: Date | null;
  };
  profileImageUrl: string | null;
  address: string | null;
  mainLanguage: string | null;
  createdAt: Date;
  role: UsersRole;
  authProvider: "local" | "google";
  googleSub: string | null;
};
