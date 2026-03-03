import { Role, UsersRole } from "../common.types.js";

export type RefreshTokenPayload = {
  userId: string;
  role: Role;
  sessionId: string;
};

export type GoogleAuthRequest = {
  idToken: string;
  role: "student" | "teacher";
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

export type RegistrationType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UsersRole;
};

export type LoginType = {
  email: string;
  password: string;
  role: "student" | "teacher";
};
