import { injectable } from "inversify";
import { VideoCallModel } from "../../db/schemes/videoCallSchema.js";
import { VideoCallViewType } from "../../types/video/video.types.js";
import { HttpError } from "../../utils/error.util.js";

@injectable()
export class VideoCallQuery {
  async getVideoByStreamCallId(
    streamCallId: string,
  ): Promise<VideoCallViewType | null> {
    try {
      const video = await VideoCallModel.findOne({ streamCallId }).lean();
      if (!video) return null;

      return video as VideoCallViewType;
    } catch (err: unknown) {
      throw new HttpError(500, "Something went wrong with video call search", {
        cause: err,
      });
    }
  }

  // returns the newest active incoming call for a student (ringing and not expired).
  async getIncomingCallForStudent(
    studentId: string,
  ): Promise<VideoCallViewType | null> {
    const now = new Date();

    try {
      return await VideoCallModel.findOne({
        studentId,
        status: "ringing",
        expiresAt: { $gt: now },
      })
        .sort({ createdAt: -1 })
        .lean();
    } catch (err: unknown) {
      throw new HttpError(500, "Something went wrong with video call search", {
        cause: err,
      });
    }
  }

  async getVideoById(id: string): Promise<VideoCallViewType | null> {
    try {
      const video = await VideoCallModel.findOne({ id }).lean();

      if (!video) return null;

      return video as VideoCallViewType;
    } catch (err: unknown) {
      throw new HttpError(500, "Something went wrong with video call search", {
        cause: err,
      });
    }
  }
} //end of class
