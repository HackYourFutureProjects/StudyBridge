import { injectable } from "inversify";
import { ReviewModel } from "../../db/schemes/review.schema.js";
import { ReviewTypeDB } from "../../db/schemes/types/review.types.js";
import { HttpError } from "../../utils/error.util.js";

@injectable()
export class ReviewCommand {
  // Create a new review in the database.
  async createReview(newReview: ReviewTypeDB) {
    try {
      const created = await ReviewModel.create(newReview);
      return created.toObject();
    } catch (err: unknown) {
      throw new HttpError(500, "Review was not created", { cause: err });
    }
  }
}
