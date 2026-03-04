import { Request, NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../composition/composition.types.js";
import { ReviewService } from "../services/review/review.service.js";
import { ReviewInputType } from "../types/review/review.types.js";
import { ReviewQuery } from "../repositories/queryRepositories/review.query.js";
import {
  validateAuthorization,
  validatePaginationParams,
} from "../utils/validation/requestValidation.util.js";

@injectable()
export class ReviewController {
  constructor(
    @inject(TYPES.ReviewService) private reviewService: ReviewService,
    @inject(TYPES.ReviewQuery) private reviewQuery: ReviewQuery,
  ) {}

  // POST - Review. Let Student to create a review
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = validateAuthorization(req.auth?.userId);
      const review = await this.reviewService.createReview(
        studentId,
        req.body as ReviewInputType,
      );
      return res.status(201).send(review);
    } catch (err) {
      return next(err);
    }
  }

  // GET - Get all reviews for a teacher
  async getReviewsForTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const teacherId = req.params.teacherId as string;
      const { page, limit } = validatePaginationParams(
        req.query.pageNumber as string,
        req.query.pageSize as string,
      );

      const DEFAULT_PAGE_NUMBER = 1;
      const DEFAULT_PAGE_SIZE = 10;
      const MAX_PAGE_SIZE = 50;

      const safePageNumber = page || DEFAULT_PAGE_NUMBER;
      const safePageSize = limit
        ? Math.min(limit, MAX_PAGE_SIZE)
        : DEFAULT_PAGE_SIZE;

      const result = await this.reviewQuery.getReviewsByTeacherId({
        teacherId,
        pageNumber: safePageNumber,
        pageSize: safePageSize,
      });
      return res.status(200).send(result);
    } catch (err) {
      return next(err);
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
      return res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }
}
