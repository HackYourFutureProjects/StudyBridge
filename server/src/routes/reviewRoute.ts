import { Router } from "express";
import { container } from "../composition/compositionRoot.js";
import { TYPES } from "../composition/composition.types.js";
import { ReviewController } from "../controllers/review.controller.js";
import { AuthMiddleware } from "../middlewares/authMiddlewareWithBearer.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";

export const reviewRouter = Router();

//
const reviewController = container.get<ReviewController>(
  TYPES.ReviewController,
);

// GET
//  Public, so anyone can see the reviews of a teacher.
reviewRouter.get(
  "/teachers/:teacherId",
  reviewController.getReviewsForTeacher.bind(reviewController),
);

// GET
// Public, so anyone can see the average rating of a teacher.
reviewRouter.get(
  "/teachers/:teacherId/rating",
  reviewController.getTeacherAverageRating.bind(reviewController),
);

// POST
// Private, so only Logged-in students can create a review.
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
reviewRouter.post(
  "/",
  authMiddleware.handle,
  reviewController.createReview.bind(reviewController),
);

reviewRouter.delete(
  "/:reviewId/moderator",
  authMiddleware.handle,
  requireRole("moderator"),
  reviewController.deleteReviewByModerator.bind(reviewController),
);
