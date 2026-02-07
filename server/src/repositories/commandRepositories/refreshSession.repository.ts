import { RefreshSessionModel } from "../../db/schemes/session.schema.js";
import { RefreshSessionDB } from "../../db/schemes/types/session.types.js";
import { injectable } from "inversify";
import { HttpError } from "../../utils/error.util.js";

@injectable()
export class RefreshSessionRepository {
  async create(session: RefreshSessionDB): Promise<void> {
    try {
      await RefreshSessionModel.create(session);
    } catch (err: unknown) {
      throw new HttpError(500, "Session was not created", { cause: err });
    }
  }

  async findById(sessionId: string): Promise<RefreshSessionDB | null> {
    try {
      return await RefreshSessionModel.findOne({ id: sessionId }).lean();
    } catch (err: unknown) {
      throw new HttpError(500, "Session was not found", { cause: err });
    }
  }

  async revoke(
    sessionId: string,
    revokedAt: Date = new Date(),
  ): Promise<boolean> {
    try {
      const res = await RefreshSessionModel.updateOne(
        { id: sessionId, revokedAt: null },
        { $set: { revokedAt } },
      );
      return res.modifiedCount === 1;
    } catch (err: unknown) {
      throw new HttpError(500, "Session was not updated", { cause: err });
    }
  }

  async revokeAllForUser(
    userId: string,
    role?: RefreshSessionDB["role"],
    revokedAt: Date = new Date(),
  ): Promise<number> {
    try {
      const filter: Record<string, unknown> = { userId, revokedAt: null };
      if (role) {
        filter.role = role;
      }
      const res = await RefreshSessionModel.updateMany(filter, {
        $set: { revokedAt },
      });

      return res.modifiedCount;
    } catch (err: unknown) {
      throw new HttpError(500, "Sessions were not updated", { cause: err });
    }
  }

  async replace(oldSessionId: string, newSessionId: string): Promise<boolean> {
    try {
      const res = await RefreshSessionModel.updateOne(
        { id: oldSessionId, revokedAt: null },
        { $set: { revokedAt: new Date(), replacedBySessionId: newSessionId } },
      );
      return res.modifiedCount === 1;
    } catch (err: unknown) {
      throw new HttpError(500, "Session was not updated", { cause: err });
    }
  }

  async deleteExpiredNow(): Promise<number> {
    try {
      const res = await RefreshSessionModel.deleteMany({
        expiresAt: { $lte: new Date() },
      });
      return res.deletedCount ?? 0;
    } catch (err: unknown) {
      throw new HttpError(500, "Session was not deleted", { cause: err });
    }
  }
}
