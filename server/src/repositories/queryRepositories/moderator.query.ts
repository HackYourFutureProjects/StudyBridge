import { injectable } from "inversify";
import { ModeratorViewType } from "../../types/moderator/moderator.js";
import { ModeratorModel } from "../../db/schemes/moderator.schema.js";
import { moderatorMapper } from "../../utils/mappers/moderator.mapper.js";

@injectable()
export class ModeratorQuery {
  async getModeratorByEmail(email: string): Promise<ModeratorViewType | null> {
    try {
      const moderator = await ModeratorModel.findOne({ email }).lean();
      if (!moderator) {
        return null;
      }
      return moderatorMapper(moderator);
    } catch (err: unknown) {
      throw new Error("Something went wrong with moderator search", {
        cause: err,
      });
    }
  }

  async getModeratorByEmailWithHash(email: string) {
    try {
      const moderator = await ModeratorModel.findOne({ email }).lean();
      if (!moderator) {
        return null;
      }
      return moderator;
    } catch (err: unknown) {
      throw new Error("Something went wrong with moderator search", {
        cause: err,
      });
    }
  }

  async getModeratorById(id: string) {
    try {
      const moderator = await ModeratorModel.findOne({ id }).lean();
      if (!moderator) {
        return null;
      }
      return moderatorMapper(moderator);
    } catch (err: unknown) {
      throw new Error("Something went wrong with moderator search", {
        cause: err,
      });
    }
  }
}
