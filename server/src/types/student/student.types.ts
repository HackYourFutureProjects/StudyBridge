import { Role } from "../common.types.js";

export type StudentViewType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string | null;
  address: string | null;
  mainLanguage: string | null;
  createdAt: Date;
  role: Role;
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
