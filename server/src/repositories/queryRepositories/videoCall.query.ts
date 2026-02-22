import { injectable } from "inversify";
import { VideoCallModel } from "../../db/schemes/videoCallSchema.js";
import { VideoCallViewType } from "../../types/video/video.types.js";

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
      throw new Error("Something went wrong with video call search", {
        cause: err,
      });
    }
  }
}
