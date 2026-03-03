import { StudentType } from "../student/student.type";
import { TeacherType } from "../teacher/teacher.type";

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

export type UserType = StudentType | TeacherType;

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
