import { UsersRole } from "../../../types/common.types.js";
import { ObjectId } from "mongodb";
export type TeacherStatus =
  | "draft"
  | "pending"
  | "active"
  | "rejected"
  | "blocked";
type EducationItem = {
  degree: string;
  institution: string;
};

type SubjectItem = {
  _id: ObjectId;
  subjectName: string;
  description: string | null;
  levels: Array<{ level: string; price: number }>;
  experienceYears: number;
  hourlyRate: number;
};

type TimeSlot = {
  start: string;
  end: string;
};

type AvailabilityItem = {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
};

export type AddressItem = {
  street: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
};

export type TeacherTypeDB = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash?: string | null;
  passwordSalt?: string | null;
  passwordReset: {
    tokenHash: string | null;
    expiresAt: Date | null;
  };
  priceFrom: number;
  rating: number;
  profileImageUrl: string | null;
  experience: number;
  bio: string | null;
  headline: string | null;
  phoneNumber: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  mainLanguage: string | null;
  education: EducationItem[];
  subjects: SubjectItem[];
  timezone: string;
  availability: AvailabilityItem;
  address: AddressItem;
  createdAt: Date;
  role: UsersRole;
  authProvider: "local" | "google";
  googleSub: string | null;
  status: TeacherStatus;
};
