import { apiProtected, apiPublic } from "../api";

import {
  ReviewType,
  PaginatedReviewsResponse,
  TeacherAverageRating,
  CreateReviewInput,
} from "./review.type";

// Get all reviews - PUBLIC -
// BE endpoint: GET /api/reviews?teacherId=xxx&pageNumber=1&pageSize=5
export async function getReviewsApi(
  teacherId: string,
  pageNumber: number = 1,
  pageSize: number = 5,
): Promise<PaginatedReviewsResponse> {
  const res = await apiPublic.get<PaginatedReviewsResponse>(
    `/api/reviews/teachers/${teacherId}`,
    {
      params: {
        pageNumber,
        pageSize,
      },
    },
  );
  return res.data;
}

// Get average rating for a teacher - PUBLIC -
// BE endpoint: GET /api/reviews/:teacherId/average-rating
export async function getTeacherAverageRatingApi(
  teacherId: string,
): Promise<TeacherAverageRating> {
  const res = await apiPublic.get<TeacherAverageRating>(
    `/api/reviews/${teacherId}/average-rating`,
  );
  return res.data;
}

// Create a review - PROTECTED -
// BE endpoint: POST /api/reviews
export async function createReviewApi(
  data: CreateReviewInput,
): Promise<ReviewType> {
  const res = await apiProtected.post<ReviewType>("/api/reviews", data);
  return res.data;
}

export async function deleteReviewByModeratorApi(reviewId: string) {
  return await apiProtected.delete(`/api/reviews/${reviewId}/moderator`);
}
