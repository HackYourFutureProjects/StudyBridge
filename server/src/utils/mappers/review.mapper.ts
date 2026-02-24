import { WithId } from "mongodb";
import { ReviewTypeDB } from "../../db/schemes/types/review.types.js";
import { ReviewOutputModel } from "../../types/review/review.types.js";

// Transform a MongoDb document of type ReviewTypeDB into a ReviewOutputModel. Which is the type that we will return to the client.

export const reviewMapper = (
  review: WithId<ReviewTypeDB>,
): ReviewOutputModel => {
  return {
    _id: review._id.toString(),
    teacherId: review.teacherId,
    studentId: review.studentId,
    studentName: review.studentName,
    studentAvatar: review.studentAvatar || null,
    rating: review.rating,
    review: review.review || "",
    subject: review.subject,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  };
};
