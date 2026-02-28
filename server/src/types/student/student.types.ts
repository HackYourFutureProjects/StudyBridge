import { Role } from "../../../index.js";

export type StudentViewType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string | null;
  address: string | null;
  mainLanguage: string | null;
  createdAt: Date;
  role: string;
  authProvider: "local" | "google";
  googleSub: string | null;
};

export type UpdateStudentProfileType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImageUrl?: string;
  password?: string;
};

export type StudentCreateBase = {
  id: string;
  role: Role;
  email: string;
  firstName: string;
  lastName: string;

  profileImageUrl?: string | null;
  address?: string | null;
  mainLanguage?: string | null;

  authProvider: "local" | "google";
  googleSub?: string | null;

  passwordReset?: {
    tokenHash: string | null;
    expiresAt: Date | null;
  };

  createdAt?: Date;
};

export type CreateLocalStudent = StudentCreateBase & {
  authProvider: "local";
  passwordHash: string;
  passwordSalt: string;
  googleSub?: null;
};

export type CreateGoogleStudent = StudentCreateBase & {
  authProvider: "google";
  googleSub: string;
};
