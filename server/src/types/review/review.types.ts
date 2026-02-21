// Inputted when creating a review
export type ReviewInputType = {
  teacherId: string;
  rating: number;
  review?: string;
  bookingId: string;
};

// The following is used to check if a student is eligible to review a teacher.
// If they are, BE send the bookingId and subject so the FE can show it in the box and use the bookingId when creating the review.

export type ReviewEligibilityResponse = {
  isEligible: boolean;
  bookingId?: string; // If true, BE provide the ID to be used in the Input
  subject?: string; // BE sends the subject so the Frontend can show it in the box
};

// Type of the review that will be sent to the FE when fetching reviews for a teacher.
export type ReviewOutputModel = {
  _id: string;
  teacherId: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string | null;
  rating: number;
  review?: string;
  subject: string;
  createdAt: Date | string;
  updatedAt: Date | string; // in case we want to let the user edit their review in the future, we can use this field to show when it was last updated
};

// (REQUEST) Type of filters and pagination settings that can be sent to the BE when fetching reviews for a teacher.
export type ReviewQueryParams = {
  teacherId: string;
  pageNumber?: number;
  pageSize?: number;
};

// (RESPONSE) Type of the response when fetching reviews for a teacher, including pagination info and the list of reviews.
export type PaginatedReviewsResponse = {
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  reviews: ReviewOutputModel[];
};

// Type of the response when fetching the average rating and total number of reviews for a teacher
//? I can use it in both the teacher profile page and also in the teachers list page to show the average rating for each teacher.
export type TeacherAverageRatingResponse = {
  teacherId: string;
  averageRating: number;
  totalReviews: number;
};
