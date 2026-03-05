import { UsersRole } from "../common.types.js";

export type StudentViewType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  profileImageUrl: string | null;
  address: string | null;
  mainLanguage: string | null;
  createdAt: Date;
  role: UsersRole;
  authProvider: "local" | "google";
  googleSub: string | null;
};

export type UpdateStudentProfileType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  password?: string;
};
