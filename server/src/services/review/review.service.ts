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

@injectable()
export class ReviewService {
  constructor(
    @inject(TYPES.ReviewCommand) private reviewCommand: ReviewCommand,
    @inject(TYPES.ReviewQuery) private reviewQuery: ReviewQuery,
    @inject(TYPES.StudentQuery) private studentQuery: StudentQuery,
    @inject(TYPES.AppointmentQuery) private appointmentQuery: AppointmentQuery,
  ) {}

  async createReview(
    studentId: string,
    reviewInput: ReviewInputType,
  ): Promise<ReviewOutputModel> {
    try {
      // check if the appointment exists
      const appointment = await this.appointmentQuery.getAppointmentById(
        reviewInput.bookingId,
      );
      if (!appointment) {
        throw new NotFoundError("Appointment not found");
      }

      //Check the student reviewing his own appointment
      if (appointment.studentId !== studentId) {
        throw new HttpError(
          403,
          "Students can only review their own appointments",
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
        studentAvatar: student.profileImageUrl || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // Save the review in the database
      const createdReview = await this.reviewCommand.createReview(newReview);
      return reviewMapper(createdReview);
    } catch (err: unknown) {
      throw new HttpError(500, "Could not create review", { cause: err });
    }
  }
}
