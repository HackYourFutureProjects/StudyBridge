export type ModeratorTypeDB = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash?: string | null;
  passwordSalt?: string | null;
  profileImageUrl: string | null;
  createdAt: Date;
  role: "moderator";
};
