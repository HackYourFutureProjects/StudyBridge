import { Role } from "../auth/types";

type EducationItem = {
  degree: string;
  institution: string;
};

type SubjectItem = {
  _id: string;
  subjectName: string;
  levels: string[];
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

export type TeacherType = {
  id: string;
  firstName: string;
  lastName: string;
  priceFrom: number;
  rating: number;
  email: string;
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
  availability: AvailabilityItem;
  address: AddressItem;
  createdAt: Date;
  role: Role;
};

export type TeacherOutputModel = {
  pagesCount?: number;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  items: TeacherType[];
};

export type SortDirection = "asc" | "desc";
export type SortBy = "createdAt" | "priceFrom" | "rating";

export type TeachersQuery = {
  subject?: string;
  minPrice?: number;
  maxPrice?: number;
  ratings?: number[];
  sortBy?: SortBy;
  sortDirection?: SortDirection;
  pageNumber?: number;
  pageSize?: number;
};
