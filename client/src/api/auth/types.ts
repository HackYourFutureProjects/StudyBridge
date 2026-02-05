import { StudentType } from "../student/student.type";
import { TeacherType } from "../teacher/teacher.type";

export type Role = "student" | "tutor";

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
