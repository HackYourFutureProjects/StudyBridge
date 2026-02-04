export type StudentTypeDB = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  profileImageUrl: string | null;
  address: string | null;
  mainLanguage: string | null;
  createdAt: Date;
  role: string;
};
