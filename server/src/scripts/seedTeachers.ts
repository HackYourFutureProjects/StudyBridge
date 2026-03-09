import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import connectDB from "../db/connectDB.js";
import { TeacherModel } from "../db/schemes/teacherSchema.js";
import { TeacherTypeDB } from "../db/schemes/types/teacher.types.js";
import { logError, logInfo } from "../utils/logging.js";

dotenv.config();

const seedPassword = "study123";

const teacherSeeds = [
  {
    firstName: "John",
    lastName: "Miller",
    subject: "English",
    city: "Amsterdam",
  },
  {
    firstName: "Sarah",
    lastName: "Smith",
    subject: "Spanish",
    city: "Rotterdam",
  },
  { firstName: "David", lastName: "Brown", subject: "French", city: "Utrecht" },
  {
    firstName: "Emily",
    lastName: "Johnson",
    subject: "German",
    city: "The Hague",
  },
  {
    firstName: "Michael",
    lastName: "Davis",
    subject: "Arabic",
    city: "Eindhoven",
  },
  {
    firstName: "Jessica",
    lastName: "Wilson",
    subject: "Dutch",
    city: "Haarlem",
  },
  {
    firstName: "Daniel",
    lastName: "Moore",
    subject: "Italian",
    city: "Leiden",
  },
  {
    firstName: "Ashley",
    lastName: "Taylor",
    subject: "Portuguese",
    city: "Delft",
  },
  {
    firstName: "Chris",
    lastName: "Anderson",
    subject: "Turkish",
    city: "Breda",
  },
  { firstName: "Laura", lastName: "Thomas", subject: "Hindi", city: "Zwolle" },
] as const;

const defaultAvailability: TeacherTypeDB["availability"] = {
  monday: [{ start: "09:00", end: "12:00" }],
  tuesday: [{ start: "13:00", end: "16:00" }],
  wednesday: [{ start: "09:00", end: "12:00" }],
  thursday: [{ start: "13:00", end: "16:00" }],
  friday: [{ start: "10:00", end: "14:00" }],
  saturday: [],
  sunday: [],
};

const createTeacherDoc = async (index: number): Promise<TeacherTypeDB> => {
  const teacher = teacherSeeds[index];
  const passwordSalt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(seedPassword, passwordSalt);

  return {
    id: randomUUID(),
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    email: `teacher${index + 1}@studybridge.com`,
    passwordHash,
    passwordSalt,
    passwordReset: {
      tokenHash: null,
      expiresAt: null,
    },
    priceFrom: 25 + index * 5,
    rating: 4,
    profileImageUrl: null,
    experience: 3 + index,
    bio: `${teacher.firstName} is an experienced ${teacher.subject} tutor.`,
    headline: `${teacher.subject} Tutor`,
    phoneNumber: `+120255501${10 + index}`,
    dateOfBirth: new Date(1985 + index, 5, 15),
    gender: null,
    mainLanguage: teacher.subject,
    education: [
      {
        degree: `Bachelor in ${teacher.subject}`,
        institution: "State University",
      },
    ],
    subjects: [
      {
        _id: new ObjectId(),
        subjectName: teacher.subject,
        levels: [
          { level: "A1", price: 25 + index * 5 },
          { level: "A2", price: 30 + index * 5 },
        ],
        description: `${teacher.firstName} is an experienced ${teacher.subject} tutor with ${3 + index} years of experience.`,
        experienceYears: 3 + index,
        hourlyRate: 25 + index * 5,
      },
    ],
    timezone: "Europe/Amsterdam",
    availability: defaultAvailability,
    address: {
      street: `${index + 1} Main Street`,
      city: teacher.city,
      state: null,
      zipCode: `100${index}AB`,
      country: "Netherlands",
    },
    createdAt: new Date(),
    role: "teacher",
    authProvider: "local",
    googleSub: null,
    status: "draft",
    isPublic: false,
  };
};

export const seedTeachers = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Refusing to run teacher seed in production");
    }

    if (process.env.SEED_TEACHERS_CONFIRM !== "yes") {
      throw new Error(
        "Set SEED_TEACHERS_CONFIRM=yes to run teacher seeding intentionally",
      );
    }

    await connectDB();

    const teachersToSeed = await Promise.all(
      Array.from({ length: 10 }, (_, index) => createTeacherDoc(index)),
    );

    const operations = teachersToSeed.map((teacher) => ({
      updateOne: {
        filter: { email: teacher.email },
        update: {
          $set: {
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            passwordReset: teacher.passwordReset,
            priceFrom: teacher.priceFrom,
            rating: teacher.rating,
            profileImageUrl: teacher.profileImageUrl,
            experience: teacher.experience,
            bio: teacher.bio,
            headline: teacher.headline,
            phoneNumber: teacher.phoneNumber,
            dateOfBirth: teacher.dateOfBirth,
            gender: teacher.gender,
            mainLanguage: teacher.mainLanguage,
            education: teacher.education,
            subjects: teacher.subjects,
            timezone: teacher.timezone,
            availability: teacher.availability,
            address: teacher.address,
            role: teacher.role,
            isPublic: teacher.isPublic,
          },
          $setOnInsert: {
            id: teacher.id,
            email: teacher.email,
            passwordHash: teacher.passwordHash,
            passwordSalt: teacher.passwordSalt,
            createdAt: teacher.createdAt,
          },
        },
        upsert: true,
      },
    }));

    const result = await TeacherModel.bulkWrite(operations, { ordered: true });

    logInfo(
      `Seed complete. Upserted: ${result.upsertedCount ?? 0}, Modified: ${result.modifiedCount ?? 0}, Matched: ${result.matchedCount ?? 0}.`,
    );

    logInfo(
      `Default seed password for newly inserted teachers only: ${seedPassword}`,
    );
  } catch (error) {
    logError("Seeding teachers failed");
    logError(error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

if (process.argv[1]?.includes("seedTeachers.ts")) {
  void seedTeachers();
}
