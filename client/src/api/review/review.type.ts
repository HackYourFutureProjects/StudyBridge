export type ReviewType = {
  _id: string;
  bookingId: string;
  teacherId: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  rating: number;
  subject?: string;
  review?: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedReviewsResponse = {
  pageCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: ReviewType[];
};

export type TeacherAverageRating = {
  teacherId: string;
  averageRating: number;
  totalReviews: number;
};

export type CreateReviewInput = {
  bookingId: string;
  rating: number;
  review?: string;
  subject?: string;
  teacherId: string;
};
