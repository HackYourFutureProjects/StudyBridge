import { Role } from "../auth/types.ts";

export type StudentType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string | null;
  address: string | null;
  mainLanguage: string | null;
  createdAt: string;
  role: Role;
};

export interface UpdateStudentProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImageUrl?: string;
}
