import { Role } from "../common.types.js";

export type EducationViewItem = {
  degree: string;
  institution: string;
};

export type SubjectViewItem = {
  id: string;
  subjectName: string;
  levels: string[];
  experienceYears: number;
  hourlyRate: number;
};

export type TimeSlotView = {
  start: string;
  end: string;
};

export type AvailabilityView = {
  monday: TimeSlotView[];
  tuesday: TimeSlotView[];
  wednesday: TimeSlotView[];
  thursday: TimeSlotView[];
  friday: TimeSlotView[];
  saturday: TimeSlotView[];
  sunday: TimeSlotView[];
};

export type AddressView = {
  street: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
};

export type TeacherViewType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string | null;
  experience: number;
  priceFrom: number;
  bio: string | null;
  headline: string | null;
  phoneNumber: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  mainLanguage: string | null;
  education: EducationViewItem[];
  subjects: SubjectViewItem[];
  availability: AvailabilityView;
  address: AddressView;
  createdAt: Date;
  role: string;
};

export type TeacherRegistrationType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
};

export type TeacherLoginType = {
  email: string;
  password: string;
};

type SortDirection = "asc" | "desc";
type SortBy = "createdAt" | "pricePerHour" | "rating";

export type QueryTeacherInput = {
  subject?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maxRating?: number;
  sortBy?: SortBy;
  sortDirection?: SortDirection;
  pageNumber?: number;
  pageSize?: number;
};

export type TeacherOutputModel = {
  pagesCount?: number;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  items: TeacherViewType[];
};
