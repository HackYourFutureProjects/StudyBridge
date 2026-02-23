export type StudentType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string | null;
  address: string | null;
  mainLanguage: string | null;
  createdAt: string;
  role: string;
};

export interface UpdateStudentProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImageUrl?: string;
  password?: string;
}
