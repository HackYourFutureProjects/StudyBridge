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
  role: string;
};

export type StudentRegistrationType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
};

export type StudentLoginType = {
  email: string;
  password: string;
};

export type UpdateStudentProfileType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImageUrl?: string;
  password?: string;
};
