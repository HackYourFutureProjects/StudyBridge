import { injectable } from "inversify";
import { VideoCallDB } from "../../db/schemes/types/videoCall.types.js";
import { VideoCallModel } from "../../db/schemes/videoCallSchema.js";
import { HttpError } from "../../utils/error.util.js";

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
}
