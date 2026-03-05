import { inject, injectable } from "inversify";
import { TYPES } from "../../composition/composition.types.js";
import { ReviewCommand } from "../../repositories/commandRepositories/review.command.js";
import { ReviewQuery } from "../../repositories/queryRepositories/review.query.js";
import { StudentQuery } from "../../repositories/queryRepositories/student.query.js";
import { AppointmentQuery } from "../../repositories/queryRepositories/appointment.query.js";
import { ReviewTypeDB } from "../../db/schemes/types/review.types.js";
import {
  ReviewInputType,
  ReviewOutputModel,
} from "../../types/review/review.types.js";
import { reviewMapper } from "../../utils/mappers/review.mapper.js";
import { HttpError, NotFoundError } from "../../utils/error.util.js";
import { TeacherCommand } from "../../repositories/commandRepositories/teacher.command.js";
import { TeacherQuery } from "../../repositories/queryRepositories/teacher.query.js";

@injectable()
export class ReviewService {
  constructor(
    @inject(TYPES.ReviewCommand) private reviewCommand: ReviewCommand,
    @inject(TYPES.ReviewQuery) private reviewQuery: ReviewQuery,
    @inject(TYPES.StudentQuery) private studentQuery: StudentQuery,
    @inject(TYPES.AppointmentQuery) private appointmentQuery: AppointmentQuery,
    @inject(TYPES.TeacherCommand) private teacherCommand: TeacherCommand,
    @inject(TYPES.TeacherQuery) private teacherQuery: TeacherQuery,
  ) {}

  async createReview(
    studentId: string,
    reviewInput: ReviewInputType,
  ): Promise<ReviewOutputModel> {
    if (
      !reviewInput.rating ||
      reviewInput.rating < 1 ||
      reviewInput.rating > 5
    ) {
      throw new HttpError(400, "Rating must be between 1 and 5");
    }

    if (!reviewInput.subject || reviewInput.subject.trim().length === 0) {
      throw new HttpError(400, "Subject is required");
    }

    try {
      // check if the appointment exists
      const appointment = await this.appointmentQuery.getAppointmentById(
        reviewInput.bookingId,
      );

      if (!appointment) {
        throw new NotFoundError("Appointment not found");
      }

      if (appointment.status !== "approved") {
        throw new HttpError(400, "You can only review approved appointments");
      }

      //Check the student reviewing his own appointment
      if (appointment.studentId !== studentId) {
        throw new HttpError(
          403,
          "Students can only review their own appointments",
        );
      }

      // check if the teacherId in the review matches the teacherId in the appointment
      if (appointment.teacherId !== reviewInput.teacherId) {
        throw new HttpError(
          403,
          "The teacherId in the review does not match the teacherId in the appointment",
        );
      }

      // check if the student has already reviewed this appointment
      const existingReviews =
        await this.reviewQuery.hasStudentReviewedAppointment(
          reviewInput.bookingId,
        );

      if (existingReviews) {
        throw new HttpError(
          409,
          "Student has already reviewed this appointment",
        );
      }

      const student = await this.studentQuery.getStudentById(studentId);
      if (!student) {
        throw new NotFoundError("Student not found");
      }

      // Create the -review object- to be saved in the -database-
      const newReview: ReviewTypeDB = {
        teacherId: reviewInput.teacherId,
        studentId: studentId,
        bookingId: reviewInput.bookingId,
        rating: reviewInput.rating,
        review: reviewInput.review,
        subject: reviewInput.subject,
        studentName: `${student.firstName} ${student.lastName}`,
        studentAvatar: student.profileImageUrl || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // Save the review in the database
      const createdReview = await this.reviewCommand.createReview(newReview);
      //Update the average rating for the teacher after creating the review

      try {
        const teacherRating = await this.reviewQuery.getTeacherAverageRating(
          reviewInput.teacherId,
        );
        await this.teacherCommand.updateTeacherAverageRating(
          reviewInput.teacherId,
          teacherRating.averageRating,
        );
      } catch (err: unknown) {
        throw new Error(
          "Review was created but failed to update the teacher's average rating",
          { cause: err },
        );
      }

      return reviewMapper(createdReview);
    } catch (err: unknown) {
      throw new HttpError(500, "Could not create review", { cause: err });
    }
  }

  async deleteReview(reviewId: string) {
    const review = await this.reviewQuery.getReviewById(reviewId);
    if (!review) {
      throw new HttpError(404, "Review not found 1");
    }

    const deleted = await this.reviewCommand.deleteReview(reviewId);
    if (!deleted) {
      throw new HttpError(404, "Review not found 2");
    }
    const averageRating = await this.reviewQuery.getTeacherAverageRating(
      review.teacherId,
    );
    await this.teacherCommand.updateTeacherAverageRating(
      review.teacherId,
      averageRating.averageRating,
    );
  }
}
