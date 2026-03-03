import { randomUUID } from "node:crypto";
import { StudentTypeDB } from "../../db/schemes/types/student.types.js";
import { TeacherTypeDB } from "../../db/schemes/types/teacher.types.js";

export function buildGoogleStudent(args: {
  email: string;
  firstName: string;
  lastName: string;
  picture: string | null;
  googleSub: string | null;
}): StudentTypeDB {
  return {
    id: randomUUID(),
    role: "student",
    email: args.email,
    firstName: args.firstName,
    lastName: args.lastName,
    profileImageUrl: args.picture,
    address: null,
    mainLanguage: null,
    passwordHash: null,
    passwordSalt: null,
    passwordReset: { tokenHash: null, expiresAt: null },
    authProvider: "google",
    googleSub: args.googleSub,
    createdAt: new Date(),
  };
}

export function buildGoogleTeacher(args: {
  email: string;
  firstName: string;
  lastName: string;
  picture: string | null;
  googleSub: string | null;
}): TeacherTypeDB {
  return {
    id: randomUUID(),
    role: "teacher",
    email: args.email,
    firstName: args.firstName,
    lastName: args.lastName,
    profileImageUrl: args.picture,
    passwordHash: null,
    passwordSalt: null,
    passwordReset: { tokenHash: null, expiresAt: null },
    priceFrom: 0,
    rating: 0,
    experience: 0,
    bio: null,
    headline: null,
    phoneNumber: null,
    dateOfBirth: null,
    gender: null,
    mainLanguage: null,
    education: [],
    subjects: [],
    timezone: "Europe/Amsterdam",
    availability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    address: {
      street: null,
      city: null,
      state: null,
      zipCode: null,
      country: null,
    },
    createdAt: new Date(),
    authProvider: "google",
    googleSub: args.googleSub,
    status: "draft",
  };
}
