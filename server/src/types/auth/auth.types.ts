export type Role = "teacher" | "student";
export type RefreshTokenPayload = {
  userId: string;
  role: Role;
  sessionId: string;
};

export type AccessTokenPayload = {
  userId: string;
  role: Role;
};

export type RotateArgs = {
  refreshToken: string;
  payload: RefreshTokenPayload;
};
