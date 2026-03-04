import { Role } from "../auth/types";
export type TeacherStatus =
  | "draft"
  | "pending"
  | "active"
  | "rejected"
  | "blocked";

export type TeacherStatusQuery = TeacherStatus | "all";

type EducationItem = {
  degree: string;
  institution: string;
};

type SubjectItem = {
  _id: string;
  subjectName: string;
  description: string | null;
  levels: Array<{ level: string; price: number }> | string[];
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
  timezone: string;
  availability: AvailabilityItem;
  address: AddressItem;
  createdAt: Date;
  status: TeacherStatus;
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
export type SortByTeachersForModerator = "status" | "createdAt";

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

export type TeachersForModeratorQuery = {
  sortBy?: SortByTeachersForModerator;
  sortDirection?: SortDirection;
  pageNumber?: number;
  pageSize?: number;
  status?: TeacherStatusQuery;
};

export type UpdateTeacherProfileInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  experience?: number;
  bio?: string;
  profileImageUrl?: string;
  education?: EducationItem[];
  subjects?: Array<{
    subjectName: string;
    description?: string;
    levels: Array<{ level: string; price: number }>;
    experienceYears: number;
    hourlyRate: number;
  }>;
};
