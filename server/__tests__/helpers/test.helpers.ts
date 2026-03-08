import { randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";
import { StudentModel } from "../../src/db/schemes/studentSchema.js";
import { TeacherModel } from "../../src/db/schemes/teacherSchema.js";
import { AppointmentModel } from "../../src/db/schemes/appointmentSchema.js";
import { StudentTypeDB } from "../../src/db/schemes/types/student.types.js";
import { TeacherTypeDB } from "../../src/db/schemes/types/teacher.types.js";
import { AppointmentTypeDB } from "../../src/db/schemes/types/appointment.types.js";

export const createTestStudent = async (
  overrides: Partial<StudentTypeDB> = {},
): Promise<StudentTypeDB> => {
  const studentData: Omit<StudentTypeDB, "_id"> = {
    id: randomUUID(),
    firstName: "John",
    lastName: "Doe",
    email: `john.doe.${Date.now()}@test.com`,
    passwordHash: "hashedpassword123",
    passwordSalt: "salt123",
    profileImageUrl: null,
    phoneNumber: null,
    address: null,
    mainLanguage: null,
    role: "student",
    authProvider: "local",
    googleSub: null,
    createdAt: new Date(),
    passwordReset: {
      tokenHash: null,
      expiresAt: null,
    },
    ...overrides,
  };

  return await StudentModel.create(studentData);
};

export const createTestTeacher = async (
  overrides: Partial<TeacherTypeDB> = {},
): Promise<TeacherTypeDB> => {
  const teacherData: Omit<TeacherTypeDB, "_id"> = {
    id: randomUUID(),
    firstName: "Jane",
    lastName: "Smith",
    email: `jane.smith.${Date.now()}@test.com`,
    passwordHash: "hashedpassword123",
    passwordSalt: "salt123",
    profileImageUrl: null,
    priceFrom: 25,
    rating: 0,
    experience: 0,
    bio: "Experienced math teacher",
    headline: null,
    phoneNumber: null,
    dateOfBirth: null,
    gender: null,
    status: "active",
    mainLanguage: null,
    education: [
      {
        degree: "Bachelor of Science",
        institution: "University of Mathematics",
      },
    ],
    subjects: [
      {
        _id: new ObjectId(),
        subjectName: "Mathematics",
        description: "Advanced mathematics tutoring",
        levels: [
          { level: "Beginner", price: 25 },
          { level: "Intermediate", price: 30 },
        ],
        experienceYears: 5,
        hourlyRate: 25,
      },
    ],
    timezone: "Europe/Amsterdam",
    availability: {
      monday: [
        { start: "09:00", end: "10:00" },
        { start: "10:00", end: "11:00" },
      ],
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
    role: "teacher",
    authProvider: "local",
    googleSub: null,
    createdAt: new Date(),
    passwordReset: {
      tokenHash: null,
      expiresAt: null,
    },
    ...overrides,
  };

  return await TeacherModel.create(teacherData);
};

export const createTestAppointment = async (
  studentId: string,
  teacherId: string,
  overrides: Partial<AppointmentTypeDB> = {},
): Promise<AppointmentTypeDB> => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 1);

  const appointmentData: Omit<AppointmentTypeDB, "_id"> = {
    id: randomUUID(),
    studentId,
    teacherId,
    lesson: "Mathematics",
    level: "Beginner",
    teacher: teacherId,
    student: studentId,
    price: "25",
    date: futureDate.toISOString().split("T")[0],
    time: "10:00",
    status: "pending",
    description: "Math lesson",
    videoCall: `https://meet.google.com/${teacherId}-${studentId}-${Date.now()}`,
    isRegularStudent: false,
    weeklySchedule: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };

  return await AppointmentModel.create(appointmentData);
};

export const getFutureDate = (daysFromNow = 1): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split("T")[0];
};

export const getPastDate = (daysAgo = 1): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};
