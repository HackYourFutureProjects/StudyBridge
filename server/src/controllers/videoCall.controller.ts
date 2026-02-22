import { inject, injectable } from "inversify";
import { RequestWithBody } from "../types/common.types.js";
import { VideoCallService } from "../services/video/videoCall.service.js";
import { NextFunction, Response } from "express";
import { TYPES } from "../composition/composition.types.js";
import { CreateVideoCallType } from "../types/video/video.types.js";

@injectable()
export class VideoCallController {
  constructor(
    @inject(TYPES.VideoCallService) private videoCallService: VideoCallService,
  ) {}

  async startVideoCallController(
    req: RequestWithBody<CreateVideoCallType>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const auth = req.auth;
      if (!auth) return res.sendStatus(401);

      const videoCall = await this.videoCallService.startCall({
        ...req.body,
        authUserId: auth.userId,
        authRole: auth.role,
      });

      return res.status(201).json(videoCall);
    } catch (error) {
      return next(error);
    }
  }
}
