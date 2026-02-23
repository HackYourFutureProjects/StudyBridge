import { injectable } from "inversify";
import { VideoCallDB } from "../../db/schemes/types/videoCall.types.js";
import { VideoCallModel } from "../../db/schemes/videoCallSchema.js";
import { HttpError } from "../../utils/error.util.js";
import { VideoCallViewType } from "../../types/video/video.types.js";

@injectable()
export class VideoCallCommand {
  async startVideoCall(newVideoCall: VideoCallDB) {
    try {
      const created = await VideoCallModel.create(newVideoCall);
      return created.toObject();
    } catch (err: unknown) {
      throw new HttpError(500, "Video call was not created", { cause: err });
    }
  }

  async markExpiredCallAsMissed(
    callId: string,
  ): Promise<VideoCallViewType | null> {
    const now = new Date();

    try {
      const updated = await VideoCallModel.findOneAndUpdate(
        { id: callId, status: "ringing", expiresAt: { $lte: now } },
        { $set: { status: "missed", updatedAt: now } },
        { new: true },
      ).lean();

      return updated as VideoCallViewType | null;
    } catch (err: unknown) {
      throw new HttpError(500, "Something went wrong with updating call", {
        cause: err,
      });
    }
  }

  async acceptCallById(callId: string): Promise<VideoCallViewType | null> {
    const now = new Date();

    try {
      const updated = await VideoCallModel.findOneAndUpdate(
        { id: callId },
        {
          $set: {
            status: "accepted",
            startedAt: now,
            updatedAt: now,
          },
        },
        { new: true },
      ).lean();

      return updated as VideoCallViewType | null;
    } catch (err: unknown) {
      throw new HttpError(500, "Something went wrong with updating call", {
        cause: err,
      });
    }
  }
}
