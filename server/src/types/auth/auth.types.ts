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

export type PasswordResetTokenPayload = {
  userId: string;
  role: Role;
  purpose: "password-reset";
};

export type RotateArgs = {
  refreshToken: string;
  payload: RefreshTokenPayload;
};
