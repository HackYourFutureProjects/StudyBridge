export type StudentTypeDB = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  profileImageUrl: string;
  address: string;
  mainLanguage: string;
  createdAt: Date;
  role: string;
};
