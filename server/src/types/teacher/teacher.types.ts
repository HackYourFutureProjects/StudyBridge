export type EducationViewItem = {
  degree: string;
  institution: string;
};

export type SubjectViewItem = {
  _id: string;
  subjectName: string;
  description: string | null;
  levels: Array<{ level: string; price: number }>;
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

export type ReplaceWeekAvailabilityBody = {
  availability: AvailabilityView;
  timezone?: string;
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
  bio: string | null;
  headline: string | null;
  phoneNumber: string | null;
  dateOfBirth: Date | null;
  priceFrom: number;
  rating: number;
  gender: string | null;
  mainLanguage: string | null;
  education: EducationViewItem[];
  subjects: SubjectViewItem[];
  timezone: string;
  availability: AvailabilityView;
  address: AddressView;
  createdAt: Date;
  role: string;
};

type SortDirection = "asc" | "desc";
type SortBy = "createdAt" | "priceFrom" | "rating";

export type QueryTeacherInput = {
  subject: string;
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

export type UpdateTeacherProfileInput = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  experience?: number;
  bio?: string;
  profileImageUrl?: string;
  education?: EducationViewItem[];
  subjects?: Array<{
    subjectName: string;
    description?: string;
    levels: Array<{ level: string; price: number }>;
    experienceYears: number;
    hourlyRate: number;
  }>;
};
