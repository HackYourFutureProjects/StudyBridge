import { injectable } from "inversify";
import { ReviewModel } from "../../db/schemes/review.schema.js";
import {
  PaginatedReviewsResponse,
  ReviewQueryParams,
  TeacherAverageRatingResponse,
} from "../../types/review/review.types.js";
import { reviewMapper } from "../../utils/mappers/review.mapper.js";

// This repository is responsible for handling all the queries related to reviews

@injectable()
export class ReviewQuery {
  async getReviewsByTeacherId(
    params: ReviewQueryParams,
  ): Promise<PaginatedReviewsResponse> {
    try {
      const { teacherId, pageNumber = 1, pageSize = 10 } = params;

      const skip = (pageNumber - 1) * pageSize; // Calculate how many reviews to skip based on the current page number and page size

      //  To fetch the reviews for a teacher with pagination and also get the total count of reviews for that teacher.
      const [reviewsDoc, totalCount] = await Promise.all([
        ReviewModel.find({ teacherId })
          .sort({ createdAt: -1 }) // Sort reviews depending on creation date and newest first
          .skip(skip) // Skip the reviews that are before the current page
          .limit(pageSize) // size of reviews per page
          .lean(), //
        ReviewModel.countDocuments({ teacherId }), // Total count of reviews for the teacher
      ]);

      const mappedReviews = reviewsDoc.map(reviewMapper); // transform the reviews from the database format to the format that we want to return to the client

      const pageCount = Math.ceil(totalCount / pageSize); //  Total number of pages

      return {
        pageCount,
        pageNumber,
        pageSize,
        totalCount,
        reviews: mappedReviews,
      };
    } catch (err: unknown) {
      throw new Error(
        "Could not fetch reviews for the teacher, something went wrong with the database query",
        {
          cause: err,
        },
      );
    }
  }

  //
  async getTeacherAverageRating(
    teacherId: string,
  ): Promise<TeacherAverageRatingResponse> {
    try {
      const result = await ReviewModel.aggregate([
        { $match: { teacherId } },
        {
          $group: {
            _id: "$teacherId",
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]);
      if (result.length === 0) {
        return {
          teacherId,
          averageRating: 0,
          totalReviews: 0,
        };
      }
      return {
        teacherId: result[0]._id,
        averageRating: Math.round(result[0].averageRating * 2) / 2, // Round to the nearest 0.5
        totalReviews: result[0].totalReviews,
      };
    } catch (err: unknown) {
      throw new Error("Could not fetch average rating for the teacher", {
        cause: err,
      });
    }
  }

  async getReviewById(id: string) {
    try {
      const review = await ReviewModel.findOne({ _id: id }).lean();
      if (!review) {
        return null;
      }
      return review;
    } catch (err: unknown) {
      throw new Error("Something went wrong with review search", {
        cause: err,
      });
    }
  }

  // Check if the student has already reviewed the appointment
  async hasStudentReviewedAppointment(bookingId: string): Promise<boolean> {
    try {
      const existingReview = await ReviewModel.findOne({ bookingId }).lean();
      return !!existingReview; // Return true if a review exists, false otherwise
    } catch (err: unknown) {
      throw new Error(
        "Could not check if the student has already reviewed the appointment",
        {
          cause: err,
        },
      );
    }
  }
}
