import { Request, NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../composition/composition.types.js";
import { ReviewService } from "../services/review/review.service.js";
import { ReviewInputType } from "../types/review/review.types.js";
import { ReviewQuery } from "../repositories/queryRepositories/review.query.js";

@injectable()
export class ReviewController {
  constructor(
    @inject(TYPES.ReviewService) private reviewService: ReviewService,
    @inject(TYPES.ReviewQuery) private reviewQuery: ReviewQuery,
  ) {}

  // POST - Review. Let Student to create a review
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = (req as any).user.id;
      const review = await this.reviewService.createReview(
        studentId,
        req.body as ReviewInputType,
      );
      res.status(201).send(review);
    } catch (err) {
      next(err);
    }
  }

  // GET - Get all reviews for a teacher
  async getReviewsForTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const teacherId = req.params.teacherId as string;
      const { pageNumber, pageSize } = req.query;

      const result = await this.reviewQuery.getReviewsByTeacherId({
        teacherId,
        pageNumber: pageNumber ? Number(pageNumber) : 1,
        pageSize: pageSize ? Number(pageSize) : 10,
      });

      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }

  // GET - Get average rating for a teacher
  async getTeacherAverageRating(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const teacherId = req.params.teacherId as string;
      const result = await this.reviewQuery.getTeacherAverageRating(teacherId);
      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }
}
