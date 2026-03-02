export type ModeratorViewType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string | null;
  createdAt: Date;
  role: "moderator";
};
