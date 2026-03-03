import { StudentType } from "../student/student.type";
import { TeacherType } from "../teacher/teacher.type";
import { ModeratorType } from "../moderator/moderator.type.ts";

export type Role = "student" | "teacher" | "moderator";

export type RegisterFormTypes = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type RegisterFinalType = RegisterFormTypes & {
  role: Role;
};

export type UserType = StudentType | TeacherType | ModeratorType;

export type LoginFormTypes = {
  email: string;
  password: string;
};

export type LoginFinalType = LoginFormTypes & {
  role: Role;
};

export type GoogleAuthRequest = {
  idToken: string;
  role: Role;
};

export type Intent = "login" | "register";
