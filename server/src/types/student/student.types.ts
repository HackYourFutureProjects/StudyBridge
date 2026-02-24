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

export type UpdateStudentProfileType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImageUrl?: string;
  password?: string;
};
